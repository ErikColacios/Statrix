"use server"
import { pool } from "@/util/postgres";

/**
 * Returns the information of the list (list_id, list_name and list_creationdate)
 * @param listId 
 * @param user_id 
 * @returns data
 */
export async function getListInfo(listId: string, userId: string) {
    try {
        const res = await pool.query(
            `SELECT lst.list_id, lst.list_name, lst.list_creationdate, lst.list_description, lst.list_visibility, lst.user_id, usr.user_name, avt.avatar_image
             FROM list lst
             INNER JOIN users usr ON usr.user_id = lst.user_id
             INNER JOIN avatar_images avt ON avt.avatar_image_id = usr.user_avatar_id
             WHERE list_id = $1
             GROUP BY lst.list_id, lst.list_name, lst.list_creationdate, lst.list_description, lst.list_visibility, lst.user_id, usr.user_name, avt.avatar_image`,
            [listId]
        );
        return res.rows;
    } catch (error) {
        console.error("Error fetching list info:", error);
        return error;
    }
}
