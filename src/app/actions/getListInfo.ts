import { pool } from "@/util/postgres";

/**
 * Returns the information of the list (list_id, list_name and list_creationdate)
 * @param list_id 
 * @param user_id 
 * @returns data
 */
export async function getListInfo(list_id:string, user_id:string) {
    console.log(list_id)
    try{
        const res = await pool.query(`SELECT list_id, list_name, list_creationdate
            FROM list
            WHERE user_id = '${user_id}'
            AND list_id = '${list_id}' 
            GROUP BY list_id, list_name, list_creationdate`);
        return res.rows
    }catch(error){
        console.log(error)
    }


    // SELECT list_id, list_name, list_creationdate FROM list WHERE user_id = user_id_input AND list_id = list_id_input GROUP BY list_id, list_name, list_creationdate;
    // const {data, error} = await supabase.rpc('getlistinfo', {user_id_input: user_id, list_id_input: listId})
    // if(error){
    //     console.log(error)
    // }else{
    //     if(data !== undefined &&  data !== null){
    //         return data;
    //     }
    // }
}