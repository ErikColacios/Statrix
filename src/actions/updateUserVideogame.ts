"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getUserVideogame from "./getUserVideogame";

export default async function updateUserVideogame(gameId: number, newStatus: string | undefined, newScore: number, newHoursPlayed: number, newYearCompleted: string, newStarred: boolean, gameName:string, gameImageId:string) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  newScore = isNaN(newScore) ? 0 : newScore;
  newHoursPlayed = isNaN(newHoursPlayed) ? 0 : newHoursPlayed;
  //newYearCompleted = isNaN(newYearCompleted) ?  null : newYearCompleted;

  const rows = await getUserVideogame(gameId);

  try {
    if (rows.length == 0) {
      // If the user has no data with this game we add it
      const gameBaseImage:string = `https://images.igdb.com/igdb/image/upload/t_720p/${gameImageId}.png`;

      await pool.query(
        `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, year_completed, game_name, game_image_id, game_base_image, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          userId,
          gameId,
          newStarred,
          newScore,
          newHoursPlayed,
          newYearCompleted,
          gameName,
          gameImageId,
          gameBaseImage,
          newStatus,
        ],
      );
    } else {
      await pool.query(
        `UPDATE user_videogame SET status = $1, score = $2, hours_played= $3, year_completed = $4, favourite = $5
          WHERE user_id = $6 AND game_id = $7`,
        [newStatus, newScore, newHoursPlayed, newYearCompleted, newStarred, userId, gameId ]
      );
      return { success: true, message: "Game info updated successfully." };
    }
  } catch (error) {
    return { success: false, message: "There was an error saving the game info." };
  }
}
