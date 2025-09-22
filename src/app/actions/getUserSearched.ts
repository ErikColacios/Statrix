"use server"
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";

export default async function getUserSearched(userSearched: string) {
    const session = await getSession()
    const user_id:string | undefined = session.user_id
    
    if (!userSearched) {
        throw new Error("The parameter userSearched is mandatory");
    }

    try {
        const query = `SELECT * FROM users usr
        INNER JOIN avatar_images avi ON usr.user_avatar_id = avi.avatar_image_id
        LEFT OUTER JOIN user_friendships uf ON 
            (uf.requester_id = usr.user_id AND uf.addressee_id = $1)
            OR (uf.requester_id = $1 AND uf.addressee_id = usr.user_id)
        WHERE LOWER(usr.user_name) LIKE LOWER($2 || '%')
        AND usr.user_name <> $2`;
        const { rows } = await pool.query(query, [user_id, userSearched]);
        return rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}