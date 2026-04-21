"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function getUserSearched(userSearched: string) {
    const session:any = await getSessionUser()
    const userId:string | undefined = session.user.id as string
    const userName:string | undefined = session.user.name as string
    
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
        AND usr.user_name <> $3`;
        const { rows } = await pool.query(query, [userId, userSearched, userName]);
        return rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}