import { pool } from "@/util/postgres";

/**
 * Gets the total hours played for the user.
 * @param user_name User name
 * @returns Total hours played as number
 */
export async function getUserTotalHoursPlayed(user_name:string | undefined) {
    if (!user_name) {
        console.warn("Parameter user_name not found.");
        return 0;
    }

    try {
        const res = await pool.query(
            `SELECT SUM(uv.hours_played) AS sum_hours_played
             FROM user_videogame uv
             INNER JOIN users usr ON usr.user_id = uv.user_id
             WHERE usr.user_name = $1`,
            [user_name]
        );

        const totalHoursPlayed: number = res.rows[0].sum_hours_played ?? 0;
        return totalHoursPlayed;

    } catch (error) {
        console.error("Error fetching total hours played:", error);
        return 0;
    }
}
