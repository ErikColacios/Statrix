"use server"
import type { Videogame } from '../types/Videogame';
import { v4 as uuid } from "uuid";
import { getSession } from './getSession';
import { pool } from '@/util/postgres';

export async function insertList(list_name:string, gameList:Videogame[]){

    let videogameCount:number = gameList.length;
    const session = await getSession()
    const list_id = uuid();
    const user_id = session.user_id;
    const user_name = session.user_name;
    const favourite = false;
    const score = 0;
    const hours_played = 0;

    for (let i = 0; i < videogameCount; i++) {
        const videogame_id = gameList[i].id;
        const videogame_name = gameList[i].name;
        const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${gameList[i].cover.image_id}.png`;

        // First, we insert the new line to the LIST table and then in the USER_VIDEOGAME table
        try {
            await pool.query(
                `INSERT INTO list (list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image )
                VALUES ('${list_id}', '${user_id}', '${videogame_id}', '${list_name}', '${user_name}', '${videogame_name}', '${videogame_base_image}' )`);

            await pool.query(
                `INSERT INTO user_videogame (user_id, videogame_id, favourite, score, hours_played, videogame_name, videogame_base_image )
                VALUES ('${user_id}', '${videogame_id}', '${favourite}', ${score}, ${hours_played}, '${videogame_name}', '${videogame_base_image}' )`);

            console.log("List created successfuly!")
        } catch (error){
            console.log(error)
        }
    }

    // Then, we get the NUMBER of LISTS of this user
    try {
        console.log("entra")
        const res = await pool.query(`SELECT user_lists from users WHERE user_id = '${user_id}'`)
        // Finally, we update the new quantity of lists of this user we ADD 1, because we are inserting a new list
        let newNumberOfLists = res.rows[0].user_lists;
        newNumberOfLists = newNumberOfLists +1;

        await pool.query(`UPDATE users SET user_lists= ${newNumberOfLists} WHERE user_id = '${user_id}'`)
        console.log("User " + user_name + " now has "+newNumberOfLists +" list/s.")

    } catch (error) {
        console.log(error)
    }
}