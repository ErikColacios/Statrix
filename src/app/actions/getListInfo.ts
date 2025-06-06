import { pool } from "@/util/postgres";

/**
 * Returns the information of the list (list_id, list_name and list_creationdate)
 * @param list_id 
 * @param user_id 
 * @returns data
 */
export async function getListInfo(list_id: string, user_id: string) {
    try {
        const res = await pool.query(
            `SELECT list_id, list_name, list_creationdate
             FROM list
             WHERE user_id = $1 AND list_id = $2
             GROUP BY list_id, list_name, list_creationdate`,
            [user_id, list_id]
        );
        return res.rows;
    } catch (error) {
        console.error("Error fetching list info:", error);
        return null;
    }
}
