"use server"
import { supabase } from '../../utils/supabase'
import type { Videogame } from '../types/Videogame';
import { v4 as uuid } from "uuid";
import { getSession } from './getSession';

export async function insertList(list_name:string, gameList:Videogame[]){

    let videogameCount:number = gameList.length;
    const list_id = uuid();
    const session = await getSession()
    const user_id = session.user_id;
    const user_name = session.user_name;

    for (let i = 0; i < videogameCount; i++) {
        const videogame_id = gameList[i].id;
        const videogame_name = gameList[i].name;
        const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${gameList[i].cover.image_id}.png`;

        // First, we insert the new LIST
        const { error } = await supabase.from('list').insert({list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image});
        if(error){
            console.log(error)
            return;
        }else{
            console.log("List created successfuly!")
        }
    }

    // Then, we get the NUMBER of LISTS of this user
    const { data:result, error } = await supabase.from('user').select('user_lists').eq('user_id', user_id)
    if (error) {
        console.log(error)
    } else {
        // Finally, we update the new quantity of lists of this user (data is the number of lists)
        // In this case, we ADD 1, because we are inserting a new list
        let newNumberOfLists = result[0].user_lists;
        newNumberOfLists = newNumberOfLists +1;
        console.log(newNumberOfLists)

        const { error } = await supabase.from('user')
        .update({user_lists: newNumberOfLists})
        .eq('user_id',user_id)

        if (error){
            console.log(error)
        }else{
            console.log("User " + user_name + " now has "+newNumberOfLists +" list/s.")
        }
    }
}