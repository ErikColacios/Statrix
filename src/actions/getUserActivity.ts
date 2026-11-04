import { pool } from "@/util/postgres";

/**
 * Gets the recent user activity.
 * @param user_name User name
 * @param limit Max number of activities returned
 * @returns User activity, or an empty array if there is none or the query fails
 */
export async function getUserActivity(userName:string | undefined, limit: number = 10): Promise<Activity[]> {
    if (!userName) {
        console.warn("Parameter userName not found.");
        return [];
    }

    try {
        const res = await pool.query(
            `SELECT usr.user_id, usr.user_name, uga.game_id, uga.activity_id, uga.game_name, uga.game_base_image, uga.action, uga.action_date
             FROM user_game_activity uga
             INNER JOIN users usr ON uga.user_id = usr.user_id
             WHERE uga.user_name = $1
             ORDER BY action_date DESC, activity_id DESC
             LIMIT $2;`,
            [userName, limit]
        );

        return res.rows;

    } catch (error) {
        console.error("Error fetching user activity:", error);
        return [];
    }
}
