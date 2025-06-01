"use server";

import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateHoursPlayed(videogame_id: string, newHoursPlayed: number) {
  const session = await getSession();
  const user_id = session?.user_id;

  if (!user_id) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  if (typeof newHoursPlayed !== 'number' || isNaN(newHoursPlayed) || newHoursPlayed < 0) {
    return { success: false, message: "Invalid number of hours." };
  }

  try {
    await pool.query(
      `UPDATE user_videogame SET hours_played = $1 WHERE user_id = $2 AND videogame_id = $3`,
      [newHoursPlayed, user_id, videogame_id]
    );

    console.log(`Hours played updated to: ${newHoursPlayed}`);
    return { success: true, message: "Hours played updated." };
  } catch (error) {
    console.error("Error updating hours played:", error);
    return { success: false, message: "Database error." };
  }
}
