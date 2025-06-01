import { pool } from "@/util/postgres";

export async function getListContent(list_id:string, user_id:string) {


// SELECT list_id, list_name, list_creationdate FROM list WHERE user_id = user_id_input AND list_id = list_id_input GROUP BY list_id, list_name, list_creationdate;
//const {data, error} = await supabase.from('list').select(`videogame_id, videogame_name, videogame_base_image, user_videogame (score, hours_played)`)
//const {data, error} = await supabase.from('list').select(`videogame_id, videogame_name, videogame_base_image`)
//.match({list_id: listId, user_id: user_id}).order('score', { ascending: false })


// CREATE OR REPLACE FUNCTION getUserVideogamesInfo(list_id_input uuid, user_id_input uuid)
// RETURNS TABLE(videogame_id INT, videogame_name TEXT, videogame_base_image TEXT, score INT, hours_played INT) AS
// $$
// BEGIN
// RETURN QUERY
// SELECT li.videogame_id, li.videogame_name, li.videogame_base_image, uv.score, uv.hours_played
// FROM "list" li
// INNER JOIN user_videogame uv 
// ON uv.user_id = li.user_id 
// AND uv.videogame_id = li.videogame_id
// WHERE li.list_id = list_id_input 
// AND li.user_id = user_id_input;
// END;
// $$ LANGUAGE plpgsql;



    try{
        const res = await pool.query(`SELECT li.videogame_id, li.videogame_name, li.videogame_base_image, uv.score AS score, uv.hours_played
            FROM list li
            INNER JOIN user_videogame uv ON uv.user_id = li.user_id AND uv.videogame_id = li.videogame_id
            WHERE li.list_id = '${list_id}' 
            AND li.user_id = '${user_id}'`);
        return res.rows
    }catch(error){
        console.log(error)
    }
}