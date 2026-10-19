"use server"
import { pool } from "@/util/postgres"

export async function getListInfo(listId: string) {
    try {
        const res = await pool.query(
            `SELECT lst.list_id, lst.list_name, lst.list_creationdate, lst.list_description, lst.list_visibility, lst.list_mode, lst.user_id, lst.list_featured, usr.user_name, usr.user_avatar
             FROM list lst
             INNER JOIN users usr ON usr.user_id = lst.user_id
             WHERE list_id = $1
             GROUP BY lst.list_id, lst.list_name, lst.list_creationdate, lst.list_description, lst.list_visibility, lst.list_mode, lst.user_id, lst.list_featured, usr.user_name, usr.user_avatar`,
            [listId]
        );
        return res.rows;
    } catch (error) {
        console.error("Error fetching list info:", error);
        return error;
    }
}