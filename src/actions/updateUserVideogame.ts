"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getUserVideogame from "./getUserVideogame";

export default async function updateUserVideogame(gameId: number, newStatus: string, newScore: number, newHoursPlayed: number, gameName:string, gameBaseImage:string) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }
  console.log(newStatus)
  const rows = await getUserVideogame(gameId);
  try {
    if (rows.length == 0) {
      // If the user has no data with this game we add it
      await pool.query(
        `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, game_name, game_base_image, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          gameId,
          false,
          newScore,
          newHoursPlayed,
          gameName,
          gameBaseImage,
          newStatus,
        ],
      );
    } else {
      await pool.query(
        `UPDATE user_videogame SET status = $1, score = $2, hours_played= $3 WHERE user_id = $4 AND game_id = $5`,
        [newStatus, newScore, newHoursPlayed, userId, gameId],
      );
      return { success: true, message: "Score updated." };
    }
  } catch (error) {
    console.error("Error updating score:", error);
    return { success: false, message: "There was an error updating game info." };
  }
}
