"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateFavourite(game_id:string, starred:boolean){
    const session = await getSession()
    const user_id = session.user_id
    console.log(starred)

    if (!user_id) {
        return { success: false, message: "No user session found." };
    }

    try{
        await pool.query(`UPDATE user_videogame SET favourite = $1 WHERE user_id = $2 AND game_id = $3`,
            [starred, user_id, game_id])
        return { success: true, message: "Favourite game updated." };
    }catch(error){
        console.error("Error updating favourite:", error);
        return { success: false, message: "Database error." };
    }
}