import { pool } from "@/util/postgres";

/**
 * Gets the recent user activity.
 * @param user_name User name
 * @returns User activity
 */
export async function getUserActivity(userName:string | undefined) {
    if (!userName) {
        console.warn("Parameter userName not found.");
        return 0;
    }

    try {
        const res = await pool.query(
            `SELECT usr.user_id, usr.user_name, uga.game_id, uga.activity_id, uga.game_name, uga.game_base_image, uga.action, uga.action_date, avi.avatar_image
             FROM user_game_activity uga
             INNER JOIN users usr ON uga.user_id = usr.user_id
             INNER JOIN avatar_images avi ON usr.user_avatar_id = avi.avatar_image_id
             WHERE uga.user_name = $1
             ORDER BY action_date DESC
             LIMIT 10;`,
            [userName]
        );

        return res.rows;

    } catch (error) {
        console.error("Error fetching user activity:", error);
        return 0;
    }
}
