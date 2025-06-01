import { SessionData } from "@/session_lib";
import { pool } from "@/util/postgres";
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
    
    try {
        const res = await pool.query(`SELECT SUM(hours_played) AS sum_hours_played FROM user_videogame WHERE user_id = '${session.user_id}'`)
        var totalHoursPlayed:number = res.rows[0].sum_hours_played
        
        if(totalHoursPlayed==null){
            totalHoursPlayed = 0
        }

        return totalHoursPlayed;
    } catch(error) {
        console.log(error)
        return;
    }
}