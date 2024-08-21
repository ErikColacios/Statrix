import { SessionData } from "@/session_lib";
import { supabase } from "@/utils/supabase";
import { IronSession } from "iron-session";

export async function getUserTotalHoursPlayed(session:IronSession<SessionData>) {
    // CREATE OR REPLACE FUNCTION usertotalhoursplayed(user_id_input uuid)
    // RETURNS TABLE(sum_hours_played NUMERIC) AS
    // $$
    // BEGIN
    //     RETURN QUERY
    //     SELECT SUM(hours_played)
    //     FROM "user_videogame"
    //     WHERE user_id = user_id_input;
    // END;
    // $$ LANGUAGE plpgsql;
    
    const {data, error} = await supabase.rpc('usertotalhoursplayed', {user_id_input: session.user_id})
    if(error){
        console.log(error)
    }else {
        var totalHoursPlayed:number = data[0].sum_hours_played
        if(totalHoursPlayed==null){
            totalHoursPlayed = 0
        }

        return totalHoursPlayed
    }
}