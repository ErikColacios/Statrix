"use server"
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';

export default async function updateScore(gameId:string, newScore:string){
    const session:any = await getSessionUser()
    const userId:string = session.user.id as string

    if (!userId) {
        console.warn("No user session found.");
        return { success: false, message: "No user session found." };
    }

    const parsedScore = parseFloat(newScore);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
        return { success: false, message: "Invalid score. Must be a number between 0 and 10." };
    }

    try{
        await pool.query(
        `UPDATE user_videogame SET score = $1 WHERE user_id = $2 AND game_id = $3`,
        [parsedScore, userId, gameId]
        );
        return { success: true, message: "Score updated." };
    }catch(error){
        console.error("Error updating score:", error);
        return { success: false, message: "Database error." };
    }
}