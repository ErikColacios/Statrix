"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateHoursPlayed(list_id:string, videogame_id:string, newHoursPlayed:number){
    const session = await getSession()
    const user_id = session.user_id

    try {
        await pool.query(`UPDATE user_videogame SET hours_played = ${newHoursPlayed} WHERE user_id = '${user_id}' AND videogame_id='${videogame_id}'`)
        console.log("Hours played updated to: "+ newHoursPlayed)
    } catch(error){
        console.log(error)
    }
}