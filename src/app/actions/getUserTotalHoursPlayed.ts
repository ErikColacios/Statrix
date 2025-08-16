import { SessionData } from "@/session_lib";
import { pool } from "@/util/postgres";
import { IronSession } from "iron-session";

/**
 * Gets the total hours played for the user.
 * @param session IronSession containing user_id
 * @returns Total hours played as number
 */
export async function getUserTotalHoursPlayed(user_name:string | undefined) {
    if (!user_name) {
        console.warn("Parameter user_name not found.");
        return 0;
    }

    try {
        const res = await pool.query(
            `SELECT SUM(hours_played) AS sum_hours_played 
             FROM user_videogame 
             WHERE user_name = $1`,
            [user_name]
        );

        const totalHoursPlayed: number = res.rows[0].sum_hours_played ?? 0;
        return totalHoursPlayed;

    } catch (error) {
        console.error("Error fetching total hours played:", error);
        return 0;
    }
}
