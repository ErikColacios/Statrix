import { SessionData } from "@/session_lib";
import { supabase } from "@/utils/supabase";
import { IronSession } from "iron-session";

export async function getListsUser(session:IronSession<SessionData>) {
    // --- Funcion creada directamente en supabase: ---
    // CREATE OR REPLACE FUNCTION getListUser (user_id_input UUID) RETURNS TABLE (list_id_res uuid, list_name_res varchar) AS $$
    // BEGIN
    // return query SELECT list_id, list_name, list_creationdate FROM list WHERE list.user_id = user_id_input GROUP BY list_id, list_name, list_creationdate ORDER BY list_creationdate DESC;
    // END;
    // $$ language plpgsql;
    
    const {data, error} = await supabase.rpc('getlistuser', {user_id_input: session.user_id})
    if(error){
        console.log(error)
    }else{
        console.log(data)
        return data;
    }
}