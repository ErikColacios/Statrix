"use server"
import { supabase } from '../../utils/supabase'
import { Videogame } from '../types/Videogame';
import { getSession } from './getSession';

export default async function updateList(list_id:number, list_name:string, oldGamesList:Videogame[], newGamesAdded:Videogame[]){

    const session = await getSession()
    const user_id = session.user_id;
    const user_name = session.user_name;

    let oldGamesCount:number = oldGamesList.length;
    let newGamesCount:number = newGamesAdded.length;


    // First we delete the entire list
    const { error } = await supabase.from('list').delete().match({list_id: list_id, user_id: user_id})
    if(error){
        console.log(error)
        return;
    }

    // Now we insert the old games pack (oldGamesList)
    for (let i = 0; i < oldGamesCount; i++) {
        const videogame_id = oldGamesList[i].videogame_id
        const videogame_name = oldGamesList[i].videogame_name
        const videogame_base_image = oldGamesList[i].videogame_base_image;

        const { error } = await supabase.from('list').insert({list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image});
        if(error){
            console.log(error)
            return;
        }else{
            console.log("Old games inserted" + i)
        }
    }

    // Then we insert the new games pack (newGamesAdded)
    for (let i = 0; i < newGamesCount; i++) {
        const videogame_id = newGamesAdded[i].id
        const videogame_name = newGamesAdded[i].name
        const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${newGamesAdded[i].cover.image_id}.png`;

        const { error } = await supabase.from('list').insert({list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image});
        if(error){
            console.log(error)
            return;
        }else{
            console.log("New games inserted" + i)
        }
    }


}