"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateFavourite(videogame_id:string, starred:boolean){
    const session = await getSession()
    const user_id = session.user_id
    console.log(starred)

    if (!user_id) {
        return { success: false, message: "No user session found." };
    }

    if (typeof videogame_id !== 'string' || typeof starred !== 'boolean') {
        return { success: false, message: "Invalid input types." };
    }

    try{
        await pool.query(`UPDATE user_videogame SET favourite = $1 WHERE user_id = $2 AND videogame_id = $3`,
            [starred, user_id, videogame_id])
        return { success: true, message: "Videogame favourite updated." };
    }catch(error){
        console.error("Error updating favourite:", error);
        return { success: false, message: "Database error." };
    }
}