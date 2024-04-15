import { supabase } from "@/utils/supabase";

export async function getListContent(listId:string, user_id:string) {

    // SELECT list_id, list_name, list_creationdate FROM list WHERE user_id = user_id_input AND list_id = list_id_input GROUP BY list_id, list_name, list_creationdate;
    const {data, error} = await supabase.from('list').select('videogame_id, videogame_name, videogame_base_image').match({list_id: listId, user_id: user_id})

    if(error){
        console.log(error)
    }else{
        if(data !== undefined &&  data !== null){
            return data;
        }
    }
}