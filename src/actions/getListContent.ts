"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export async function getListContent(listId:string) {
    try{
        const session:any = await getSessionUser();
        const userId: string = session.user.id as string;

        if (!listId) {
            console.warn("No list found.");
            return { success: false, message: "No list found." };
        }

        if (!userId) {
            console.warn("No user session found.");
            return { success: false, message: "No user session found." };
        }
    
        const res = await pool.query(`SELECT lg.game_id, lg.game_name, lg.game_base_image, uv.score AS score, uv.hours_played, uv.favourite, uv.game_image_id,
            CASE WHEN li.user_id = $2 THEN true ELSE false END AS isowner
            FROM list li
            INNER JOIN list_games lg ON lg.list_id = li.list_id
            INNER JOIN user_videogame uv ON uv.user_id = li.user_id AND uv.game_id = lg.game_id
            WHERE li.list_id = $1
            ORDER BY uv.score DESC, uv.hours_played DESC`,
            [listId, userId]);
            
        return res.rows
    }catch(error){
        console.log(error)
        return { success: false, message: error };
    }
}