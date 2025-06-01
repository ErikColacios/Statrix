"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateScore(videogame_id:string, newScore:string){
    const session = await getSession()
    const user_id = session.user_id

    try{
        await pool.query(`UPDATE user_videogame SET score= ${newScore} WHERE user_id = '${user_id}' AND videogame_id='${videogame_id}'`)
        console.log("Score updated to: "+ newScore)
    }catch(error){
        console.log(error)
        return;
    }
}