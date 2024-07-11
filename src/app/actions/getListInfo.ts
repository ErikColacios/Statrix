import { supabase } from "@/utils/supabase";

/**
 * Returns the information of the list (list_id, list_name and list_creationdate)
 * @param listId 
 * @param user_id 
 * @returns data
 */
export async function getListInfo(listId:string, user_id:string) {

    // SELECT list_id, list_name, list_creationdate FROM list WHERE user_id = user_id_input AND list_id = list_id_input GROUP BY list_id, list_name, list_creationdate;
    const {data, error} = await supabase.rpc('getlistinfo', {user_id_input: user_id, list_id_input: listId})

    if(error){
        console.log(error)
    }else{
        if(data !== undefined &&  data !== null){
            return data;
        }
    }
}