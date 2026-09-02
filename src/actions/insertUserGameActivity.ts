"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function insertUserGameActivity(activityChanges: Activity[]) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  try {
    for (const activity of activityChanges) {
      await pool.query(
        `INSERT INTO user_game_activity (user_id, game_id, game_name, game_base_image, action, action_date)
                VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, activity.gameId, activity.gameName, activity.gameBaseImage, activity.action, activity.action_date]
      );
    }
  } catch (error) {
    return {success: false, message: "There was an error saving activity."};
  }
}
