"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getUserVideogame from "./getUserVideogame";

export default async function insertUserGameActivity(gameId: number, newStatus: string | undefined, newScore: number, newHoursPlayed: number, newYearCompleted: string, newStarred: boolean, gameName:string, gameImageId:string) {
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
        `INSERT INTO user_game_activity (user_id, game_id, game_name, game_base_image, action, action_date)
                VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId,
          gameId,
          gameName,
          gameBaseImage,
          newStarred,
          newStatus,
        ],
      );
    }
  } catch (error) {
    return { success: false, message: "There was an error saving the game info." };
  }
}
