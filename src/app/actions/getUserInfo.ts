"use server"
import { pool } from "@/util/postgres";

export default async function getUserInfo(user_id: string) {
    if (!user_id) {
        throw new Error("The parameter user_id is mandatory");
    }

    try {
        const query = `
            SELECT * FROM users usr
            INNER JOIN avatar_images avi ON avi.avatar_image_id = usr.user_avatar_id
            INNER JOIN banner_images bani ON bani.banner_image_id = usr.user_banner_id
            WHERE usr.user_id = $1
        `;

        const { rows } = await pool.query(query, [user_id]);

        return rows;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}