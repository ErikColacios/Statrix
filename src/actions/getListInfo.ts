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
            `SELECT list_id, list_name, list_creationdate, list_description, list_visibility
             FROM list
             WHERE user_id = $1 AND list_id = $2
             GROUP BY list_id, list_name, list_creationdate, list_description, list_visibility`,
            [userId, listId]
        );
        return res.rows;
    } catch (error) {
        console.error("Error fetching list info:", error);
        return error;
    }
}
