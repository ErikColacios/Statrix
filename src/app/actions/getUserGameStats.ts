import { pool } from "@/util/postgres";

type TopGame = {
  game_id: string;
  game_name: string;
  score: number;
  hours_played: number;
  game_base_image: string;
};

type UserGameStats = {
  topGames: TopGame[];
  gamesPlayed: number;
};

export default async function getUserGameStats(user_name: string | undefined): Promise<UserGameStats> {

  if (!user_name) {
    throw new Error("The parameter user_name is mandatory");
  }

  try {
    // Get total of games played
    const gamesPlayedResult = await pool.query(
      `SELECT COUNT(*)::int
       FROM user_videogame uv
       INNER JOIN users usr ON usr.user_id = uv.user_id
       WHERE usr.user_name = $1`,
      [user_name]
    );
    const gamesPlayed: number = gamesPlayedResult.rows[0].count;

    // Get top 5 games with highest rate and playtime
    const topGamesResult = await pool.query(
      `SELECT uv.game_id, uv.game_name, uv.score, uv.hours_played, uv.game_base_image
       FROM user_videogame uv
       INNER JOIN users usr ON usr.user_id = uv.user_id
       WHERE usr.user_name = $1
       ORDER BY uv.score DESC, uv.hours_played DESC
       LIMIT 5`,
      [user_name]
    );

    const topGames: TopGame[] = topGamesResult.rows;

    return {
      topGames,
      gamesPlayed,
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
}
