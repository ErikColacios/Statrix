"use server"
import { pool } from "@/util/postgres";

export default async function getUserSearched(userSearched: string) {

    if (!userSearched) {
        throw new Error("The parameter userSearched is mandatory");
    }

    try {
        const query = `SELECT * FROM users usr
        INNER JOIN avatar_images avi ON usr.user_avatar_id = avi.avatar_image_id
        WHERE LOWER(usr.user_name) LIKE LOWER($1 || '%')`;
        const { rows } = await pool.query(query, [userSearched]);
        return rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}