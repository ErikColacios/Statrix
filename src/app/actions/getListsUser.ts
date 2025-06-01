import { SessionData } from "@/session_lib";
import { pool } from "@/util/postgres";
import { IronSession } from "iron-session";

export async function getListsUser(session:IronSession<SessionData>) {

    try{
        const res = await pool.query(`SELECT list_id, list_name, list_creationdate 
            FROM list
            WHERE user_id='${session.user_id}'
            GROUP BY list_id, list_name, list_creationdate 
            ORDER BY list_creationdate DESC`);
        return res.rows
    }catch(error){
        console.log(error)
    }
}