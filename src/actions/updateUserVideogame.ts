"use server"
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';

export default async function updateUserVideogame(game_id:string, newStatus:string, newScore:number, newHoursPlayed:number){
    const session:any = await getSessionUser()
    const userId:string = session.user.id as string;

    if (!userId) {
        console.warn("No user session found.");
        return { success: false, message: "No user session found." };
    }

    try{
        await pool.query(
        `UPDATE user_videogame SET status = $1, score = $2, hours_played= $3 WHERE user_id = $4 AND game_id = $5`,
        [newStatus, newScore, newHoursPlayed, userId, game_id]
        );
        return { success: true, message: "Score updated." };
    }catch(error){
        console.error("Error updating score:", error);
        return { success: false, message: "Database error." };
    }
}