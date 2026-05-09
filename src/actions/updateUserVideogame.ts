"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getUserVideogame from "./getUserVideogame";

export default async function updateUserVideogame(gameId: number, newStatus: string | undefined, newScore: number, newHoursPlayed: number, newStarred: boolean, gameName:string, gameBaseImage:string) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }
  const rows = await getUserVideogame(gameId);

  console.log(newStarred)
  try {
    if (rows.length == 0) {
      // If the user has no data with this game we add it
      await pool.query(
        `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, game_name, game_base_image, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          gameId,
          newStarred,
          newScore,
          newHoursPlayed,
          gameName,
          gameBaseImage,
          newStatus,
        ],
      );
    } else {
      await pool.query(
        `UPDATE user_videogame SET status = $1, score = $2, hours_played= $3, favourite = $4
          WHERE user_id = $5 AND game_id = $6`,
        [newStatus, newScore, newHoursPlayed, newStarred, userId, gameId ]
      );
      //return { success: true, message: "Score updated." };
    }
  } catch (error) {
    console.error("Error updating score:", error);
    return { success: false, message: "There was an error updating game info." };
  }
}
