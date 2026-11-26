"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { MatchCandidate } from "@/types/MatchCandidate";

/**
 * Gets the users to show in the match page, ordered by affinity with the session user.
 * The affinity is the number of games in common, and the games that both users have as favourite count triple.
 * Users already swiped, users that passed the session user, and users with any friendship are excluded.
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
        if (!me.rows[0]?.matchmaking_enabled) {
            return { success: true, message: "Matchmaking is disabled.", enabled: false, candidates: [] };
        }

        const { rows } = await pool.query(
            `SELECT u.user_id, u.user_name, u.user_avatar, u.user_banner, u.user_bio, u.user_location,
                    COUNT(*)::int AS common_games,
                    SUM(CASE WHEN COALESCE(me.favourite, false) AND COALESCE(other.favourite, false) THEN 3 ELSE 1 END)::int AS affinity,
                    to_jsonb((ARRAY_AGG(
                        jsonb_build_object('game_id', other.game_id, 'game_name', other.game_name,
                                           'game_base_image', other.game_base_image, 'favourite', COALESCE(other.favourite, false))
                        ORDER BY COALESCE(other.favourite, false) DESC, other.hours_played DESC NULLS LAST
                    ))[1:6]) AS shared_games
             FROM user_videogame me
             INNER JOIN user_videogame other ON other.game_id = me.game_id AND other.user_id <> me.user_id
             INNER JOIN users u ON u.user_id = other.user_id
             WHERE me.user_id = $1
               AND u.matchmaking_enabled
               AND NOT EXISTS (SELECT 1 FROM user_swipes s WHERE s.swiper_id = $1 AND s.target_id = u.user_id)
               AND NOT EXISTS (SELECT 1 FROM user_swipes s WHERE s.swiper_id = u.user_id AND s.target_id = $1 AND NOT s.liked)
               AND NOT EXISTS (SELECT 1 FROM user_friendships f
                               WHERE (f.requester_id = $1 AND f.addressee_id = u.user_id)
                                  OR (f.requester_id = u.user_id AND f.addressee_id = $1))
             GROUP BY u.user_id
             ORDER BY affinity DESC, common_games DESC
             LIMIT 20;`,
            [userId]
        );

        return { success: true, message: "Candidates found.", enabled: true, candidates: rows };
    } catch (error) {
        console.error("Error fetching match candidates:", error);
        return { success: false, message: "Error fetching match candidates.", enabled: true, candidates: [] };
    }
}
