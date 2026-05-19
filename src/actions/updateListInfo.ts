"use server"
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';

export default async function updateListInfo(listId:string, listName:string, listDescription:string){
    const session = await getSessionUser()
    const userId = session.user.id

    if (!userId) {
        return { success: false, message: "No user session found." };
    }

    try{
        await pool.query(`UPDATE list SET list_name = $1, list_description = $2 WHERE list_id = $3 AND user_id = $4`,
            [listName, listDescription, listId, userId])
        return { success: true, message: "List information updated." };
    }catch(error){
        console.error("Error updating list information:", error);
        return { success: false, message: "Database error." };
    }
}