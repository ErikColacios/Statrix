import { pool } from "@/util/postgres";

type TopGame = {
  videogame_id: string;
  videogame_name: string;
  score: number;
  hours_played: number;
  videogame_base_image: string;
};

type UserGameStats = {
  topGames: TopGame[];
  gamesPlayed: number;
};

export default async function getUserGameStats(user_id: string): Promise<UserGameStats> {

  if (!user_id) {
    throw new Error("The parameter user_id is mandatory");
  }

  try {
    // Obtener número total de juegos jugados
    const gamesPlayedResult = await pool.query(
      `SELECT COUNT(*)::int FROM user_videogame WHERE user_id = $1`,
      [user_id]
    );
    const gamesPlayed: number = gamesPlayedResult.rows[0].count;

    // Obtener top 5 juegos con mayor puntuación y tiempo jugado
    const topGamesResult = await pool.query(
      `SELECT videogame_id, videogame_name, score, hours_played, videogame_base_image
       FROM user_videogame
       WHERE user_id = $1
       ORDER BY score DESC, hours_played DESC
       LIMIT 5`,
      [user_id]
    );

    const topGames: TopGame[] = topGamesResult.rows;

    return {
      topGames,
      gamesPlayed,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas de usuario:", error);
    throw error;
  }
}
