"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateScore(videogame_id:string, newScore:string){
    const session = await getSession()
    const user_id = session.user_id

    if (!user_id) {
        console.warn("No user session found.");
        return { success: false, message: "No user session found." };
    }

    const parsedScore = parseFloat(newScore);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
        return { success: false, message: "Invalid score. Must be a number between 0 and 10." };
    }

    try{
        await pool.query(
        `UPDATE user_videogame SET score = $1 WHERE user_id = $2 AND videogame_id = $3`,
        [parsedScore, user_id, videogame_id]
        );
        return { success: true, message: "Score updated." };
    }catch(error){
        console.error("Error updating score:", error);
        return { success: false, message: "Database error." };
    }
}