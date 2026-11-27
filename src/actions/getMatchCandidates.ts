"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { MatchCandidate, SharedGame } from "@/types/MatchCandidate";
import { GameStatus } from "@/enums/GameStatus";

/**
 * Gets the users to show in the match page, ordered by affinity with the session user.
 * The affinity is the number of games in common, and the games that both users have as favourite count triple.
 * Users already swiped, users that passed the session user, and users with any friendship are excluded.
 *
 * It's done in 4 small queries:
 *   1. The candidates (who to show and their affinity)
 *   2. The stats of their library (hours, number of games...)
 *   3. The games they have in common with the session user
 *   4. Their most played game
 * Then the results are joined in TypeScript.
 */
export default async function getMatchCandidates(): Promise<{ success: boolean, message: string, enabled: boolean, candidates: MatchCandidate[] }> {
    const session: any = await getSessionUser();
    const userId: string | undefined = session?.user?.id;

    if (!userId) {
        return { success: false, message: "No user session found.", enabled: false, candidates: [] };
    }

    try {
        // Only users that have enabled matchmaking can see other users
        const me = await pool.query(`SELECT matchmaking_enabled FROM users WHERE user_id = $1`, [userId]);
        if (me.rows[0]?.matchmaking_enabled !== true) {
            return { success: true, message: "Matchmaking is disabled.", enabled: false, candidates: [] };
        }

        const candidates = await getCandidates(userId);
        if (candidates.length === 0) {
            return { success: true, message: "No candidates found.", enabled: true, candidates: [] };
        }

        // The ids of the candidates, used by the next queries with "= ANY($1)" (like an IN with a list)
        const candidateIds = candidates.map(c => c.user_id);

        // These 3 queries don't depend on each other, so they run at the same time
        const [stats, sharedGames, mostPlayedGames] = await Promise.all([
            getLibraryStats(candidateIds),
            getSharedGames(candidateIds, userId),
            getMostPlayedGames(candidateIds),
        ]);

        // Join everything: for each candidate, we look for its stats and games
        const result: MatchCandidate[] = candidates.map(candidate => {
            const userStats = stats.find(s => s.user_id === candidate.user_id);
            const userSharedGames = sharedGames.filter(g => g.user_id === candidate.user_id);
            const mostPlayed = mostPlayedGames.find(g => g.user_id === candidate.user_id);

            return {
                user_id: candidate.user_id,
                user_name: candidate.user_name,
                user_avatar: candidate.user_avatar,
                user_banner: candidate.user_banner,
                user_bio: candidate.user_bio,
                user_location: candidate.user_location,
                // COUNT and SUM return big numbers that pg gives as strings, so we convert them with Number()
                common_games: Number(candidate.common_games),
                affinity: Number(candidate.affinity),
                // Only the first 5 are shown in the card (they come ordered: favourites first, then most played)
                shared_games: userSharedGames.slice(0, 5).map((g): SharedGame => ({
                    game_id: g.game_id,
                    game_name: g.game_name,
                    game_base_image: g.game_base_image,
                    favourite: g.favourite === true,
                })),
                total_hours: Number(userStats?.total_hours ?? 0),
                games_all: Number(userStats?.games_all ?? 0),
                games_playing: Number(userStats?.games_playing ?? 0),
                games_completed: Number(userStats?.games_completed ?? 0),
                most_played: mostPlayed ? {
                    game_id: mostPlayed.game_id,
                    game_name: mostPlayed.game_name,
                    game_base_image: mostPlayed.game_base_image,
                    hours_played: Number(mostPlayed.hours_played ?? 0),
                } : null,
            };
        });

        return { success: true, message: "Candidates found.", enabled: true, candidates: result };
    } catch (error) {
        console.error("Error fetching match candidates:", error);
        return { success: false, message: "Error fetching match candidates.", enabled: true, candidates: [] };
    }
}

/**
 * 1. The 20 users with more affinity with the session user.
 */
async function getCandidates(userId: string): Promise<any[]> {
    const { rows } = await pool.query(
        `WITH
         -- Games of the session user
         my_games AS (
             SELECT game_id, favourite
             FROM user_videogame
             WHERE user_id = $1
         ),

         -- Users that must not appear
         excluded_users AS (
             -- Users that the session user has already swiped
             SELECT target_id AS user_id FROM user_swipes WHERE swiper_id = $1
             UNION
             -- Users that have passed the session user
             SELECT swiper_id AS user_id FROM user_swipes WHERE target_id = $1 AND liked = false
             UNION
             -- Users with any friendship (friends, pending requests, blocked...) in both directions
             SELECT addressee_id AS user_id FROM user_friendships WHERE requester_id = $1
             UNION
             SELECT requester_id AS user_id FROM user_friendships WHERE addressee_id = $1
         )

         -- Each row of the join is a game that the other user has and the session user too.
         -- Grouping by user we count those games and calculate the affinity
         SELECT u.user_id, u.user_name, u.user_avatar, u.user_banner, u.user_bio, u.user_location,
                COUNT(*) AS common_games,
                SUM(CASE WHEN uv.favourite = true AND mg.favourite = true THEN 3 ELSE 1 END) AS affinity
         FROM users u
         INNER JOIN user_videogame uv ON uv.user_id = u.user_id
         INNER JOIN my_games mg ON mg.game_id = uv.game_id
         WHERE u.user_id <> $1
           AND u.matchmaking_enabled = true
           AND u.user_id NOT IN (SELECT user_id FROM excluded_users)
         GROUP BY u.user_id
         ORDER BY affinity DESC, common_games DESC
         LIMIT 20`,
        [userId]
    );
    return rows;
}

/**
 * 2. Stats of the whole library of each candidate (like the share card of the profile).
 */
async function getLibraryStats(candidateIds: string[]): Promise<any[]> {
    const { rows } = await pool.query(
        `SELECT user_id,
                COALESCE(SUM(hours_played), 0) AS total_hours,
                COUNT(*) AS games_all,
                SUM(CASE WHEN status = $2 THEN 1 ELSE 0 END) AS games_playing,
                SUM(CASE WHEN status = $3 THEN 1 ELSE 0 END) AS games_completed
         FROM user_videogame
         WHERE user_id = ANY($1)
         GROUP BY user_id`,
        [candidateIds, GameStatus.PLAYING, GameStatus.COMPLETED]
    );
    return rows;
}

/**
 * 3. Games that each candidate has in common with the session user.
 * Ordered by candidate, and inside each candidate: favourites first, then the most played.
 */
async function getSharedGames(candidateIds: string[], userId: string): Promise<any[]> {
    const { rows } = await pool.query(
        `SELECT user_id, game_id, game_name, game_base_image, favourite
         FROM user_videogame
         WHERE user_id = ANY($1)
           AND game_id IN (SELECT game_id FROM user_videogame WHERE user_id = $2)
         ORDER BY user_id,
                  CASE WHEN favourite = true THEN 0 ELSE 1 END,
                  hours_played DESC NULLS LAST`,
        [candidateIds, userId]
    );
    return rows;
}

/**
 * 4. The most played game of each candidate.
 * DISTINCT ON (user_id) keeps only the first row of each user, and ORDER BY decides which one is the first
 * (the one with more hours).
 */
async function getMostPlayedGames(candidateIds: string[]): Promise<any[]> {
    const { rows } = await pool.query(
        `SELECT DISTINCT ON (user_id) user_id, game_id, game_name, game_base_image, hours_played
         FROM user_videogame
         WHERE user_id = ANY($1)
         ORDER BY user_id, hours_played DESC NULLS LAST`,
        [candidateIds]
    );
    return rows;
}
