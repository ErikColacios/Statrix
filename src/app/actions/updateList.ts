"use server"
import { pool } from '@/util/postgres';
import { Videogame } from '../types/Videogame';
import { getSession } from './getSession';

export default async function updateList(list_id:number, list_name:string, oldGamesList:Videogame[], newGamesAdded:Videogame[]){

    const session = await getSession()
    const user_id = session.user_id;
    const user_name = session.user_name;

    let oldGamesCount:number = oldGamesList.length;
    let newGamesCount:number = newGamesAdded.length;

    try{
        // First we delete the entire list
        await pool.query(`DELETE FROM list WHERE list_id= '${list_id}' AND user_id = '${user_id}'`)

        // Now we insert the old games pack (oldGamesList)
        for (let i = 0; i < oldGamesCount; i++) {
            const videogame_id = oldGamesList[i].videogame_id
            const videogame_name = oldGamesList[i].videogame_name
            const videogame_base_image = oldGamesList[i].videogame_base_image;

            await pool.query(
                `INSERT INTO list (list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image)
                VALUES ('${list_id}', '${user_id}', '${videogame_id}', '${list_name}', '${user_name}', '${videogame_name}', '${videogame_base_image}' )`);
            
                console.log("Old games inserted" + i)
        }
    }catch(error){
        console.log(error)
        return;
    }


    // Then we insert the new games pack (newGamesAdded)
    for (let i = 0; i < newGamesCount; i++) {
        const videogame_id = newGamesAdded[i].id
        const videogame_name = newGamesAdded[i].name
        const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${newGamesAdded[i].cover.image_id}.png`;
        const score = 0;
        const hours_played = 0;
        
        await pool.query(
            `INSERT INTO list (list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image)
            VALUES ('${list_id}', '${user_id}', '${videogame_id}', '${list_name}', '${user_name}', '${videogame_name}', '${videogame_base_image}' )`);
        
        await pool.query(
            `INSERT INTO user_videogame (user_id, videogame_id, score, hours_played, videogame_name, videogame_base_image)
            VALUES ('${user_id}', '${videogame_id}', ${score}, ${hours_played}, '${videogame_name}', '${videogame_base_image}' )`);
            
        console.log("New games inserted" + i)
    }
}