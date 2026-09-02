"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function insertUserGameActivity(activityChanges: Activity[]) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;
  const userName: string = session.user.name as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  try {
    for (const activity of activityChanges) {
      await pool.query(
        `INSERT INTO user_game_activity (user_id, user_name, game_id, game_name, game_base_image, action, action_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, userName, activity.game_id, activity.game_name, activity.game_base_image, activity.action, activity.action_date]
      );
    }
  } catch (error) {
    return {success: false, message: "There was an error saving activity."};
  }
}
