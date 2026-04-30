"use server"
import { pool } from "@/util/postgres";

export default async function getUserInfo(userName: string | undefined) {
    if (!userName) {
        throw new Error("The parameter userName is mandatory");
    }
    console.log(userName)

    try {
        const query = `
            SELECT *, 
                (SELECT COUNT(1) FROM user_friendships WHERE (requester_name = $1 OR addressee_name = $1) AND status = 'Accepted') as friends
            FROM users usr
            INNER JOIN avatar_images avi ON avi.avatar_image_id = usr.user_avatar_id
            INNER JOIN banner_images bani ON bani.banner_image_id = usr.user_banner_id
            WHERE usr.user_name = $1`;

        const { rows } = await pool.query(query, [userName]);
        return rows;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}