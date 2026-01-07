"use server"
import { pool } from "@/util/postgres";

export default async function getUserInfo(user_name: string | undefined) {
    if (!user_name) {
        throw new Error("The parameter user_name is mandatory");
    }

    try {
        const query = `
            SELECT *, 
                (SELECT COUNT(*) FROM user_friendships WHERE (requester_name = $1 OR addressee_name = $1) AND status = 'Accepted') as friends
            FROM users usr
            INNER JOIN avatar_images avi ON avi.avatar_image_id = usr.user_avatar_id
            INNER JOIN banner_images bani ON bani.banner_image_id = usr.user_banner_id
            WHERE usr.user_name = $1
        `;

        const { rows } = await pool.query(query, [user_name]);

        return rows;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}