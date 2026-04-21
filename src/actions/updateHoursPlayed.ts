"use server";
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';

export default async function updateHoursPlayed(gameId: string, newHoursPlayed: number) {
  const session:any = await getSessionUser();
  const userId:string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  if (typeof newHoursPlayed !== 'number' || isNaN(newHoursPlayed) || newHoursPlayed < 0) {
    return { success: false, message: "Invalid number of hours." };
  }

  try {
    await pool.query(
      `UPDATE user_videogame SET hours_played = $1 WHERE user_id = $2 AND game_id = $3`,
      [newHoursPlayed, userId, gameId]
    );

    console.log(`Hours played updated to: ${newHoursPlayed}`);
    return { success: true, message: "Hours played updated." };
  } catch (error) {
    console.error("Error updating hours played:", error);
    return { success: false, message: "Database error." };
  }
}
