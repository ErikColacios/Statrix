import { GameStatus } from "@/enums/GameStatus";
import { pool } from "@/util/postgres";

type TopGame = {
  game_id: string;
  game_name: string;
  score: number;
  hours_played: number;
  game_base_image: string;
};

type UserGameStats = {
  gamesCompleted:number,
  topGames: TopGame[];
  gamesPlayed: number;
  favGames: TopGame[];
};

export default async function getUserGameStats(userName: string | undefined): Promise<UserGameStats> {

  if (!userName) {
    throw new Error("The parameter userName is mandatory");
  }

  try {

        // Get total of games played
    const gamesCompletedResult = await pool.query(
      `SELECT COUNT(*)::int
       FROM user_videogame uv
       INNER JOIN users usr ON usr.user_id = uv.user_id
       WHERE usr.user_name = $1 AND uv.status = $2`,
      [userName, GameStatus.COMPLETED]
    );
    const gamesCompleted: number = gamesCompletedResult.rows[0].count;

    // Get total of games played
    const gamesPlayedResult = await pool.query(
      `SELECT COUNT(*)::int
       FROM user_videogame uv
       INNER JOIN users usr ON usr.user_id = uv.user_id
       WHERE usr.user_name = $1`,
      [userName]
    );
    const gamesPlayed: number = gamesPlayedResult.rows[0].count;

    // Get top 5 games with highest playtime
    const topGamesResult = await pool.query(
      `SELECT uv.game_id, uv.game_name, uv.score, uv.hours_played, uv.game_base_image
       FROM user_videogame uv
       INNER JOIN users usr ON usr.user_id = uv.user_id
       WHERE usr.user_name = $1
       ORDER BY uv.hours_played DESC
       LIMIT 5`,
      [userName]
    );
    const topGames: TopGame[] = topGamesResult.rows;


    // Get top 5 favourite games (most playtime, and favourite)
    const favGamesResult = await pool.query(
      `SELECT uv.game_id, uv.game_name, uv.score, uv.hours_played, uv.game_base_image
       FROM user_videogame uv
       INNER JOIN users usr ON usr.user_id = uv.user_id
       WHERE usr.user_name = $1
       AND uv.favourite = true
       ORDER BY uv.hours_played DESC
       LIMIT 5`,
      [userName]
    );

    const favGames: TopGame[] = favGamesResult.rows;

    return {
      gamesCompleted,
      topGames,
      gamesPlayed,
      favGames
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
}
