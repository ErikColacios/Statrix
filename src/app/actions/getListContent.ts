import { pool } from "@/util/postgres";

export async function getListContent(list_id:string, user_id:string) {
    try{
        if (!list_id) {
            console.warn("No list found.");
            return { success: false, message: "No list found." };
        }

        if (!user_id) {
            console.warn("No user session found.");
            return { success: false, message: "No user session found." };
    }
        const res = await pool.query(`SELECT li.videogame_id, li.videogame_name, li.videogame_base_image, uv.score AS score, uv.hours_played, uv.favourite
            FROM list li
            INNER JOIN user_videogame uv ON uv.user_id = li.user_id AND uv.videogame_id = li.videogame_id
            WHERE li.list_id = $1
            AND li.user_id = $2`, [list_id, user_id]);
        return res.rows
    }catch(error){
        console.log(error)
        return { success: false, message: error };
    }
}