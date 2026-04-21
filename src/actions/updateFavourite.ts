"use server"
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';

export default async function updateFavourite(gameId:string, starred:boolean){
    const session = await getSessionUser()
    const userId = session.user.id

    if (!userId) {
        return { success: false, message: "No user session found." };
    }

    try{
        await pool.query(`UPDATE user_videogame SET favourite = $1 WHERE user_id = $2 AND game_id = $3`,
            [starred, userId, gameId])
        return { success: true, message: "Favourite game updated." };
    }catch(error){
        console.error("Error updating favourite:", error);
        return { success: false, message: "Database error." };
    }
}