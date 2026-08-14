"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export async function deleteUserVideogame(gameId: number | undefined) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    // Delete the game from the user_videogame table
    await pool.query(
      `DELETE FROM user_videogame
       WHERE game_id = $1 AND user_id = $2;`,
      [gameId, userId]
    );

    // Delete the game from the list_games table
    await pool.query(
      `DELETE FROM list_games
       WHERE game_id = $1 AND user_id = $2;`,
      [gameId, userId]
    );

  } catch (error) {
    console.error("Error deleting game: ", error);
  }
}