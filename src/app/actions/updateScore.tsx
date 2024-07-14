"use server"
import { supabase } from '../../utils/supabase'
import { getSession } from './getSession';

export default async function updateScore(list_id:string, videogame_id:string, newScore:string){
    const session = await getSession()
    const user_id = session.user_id

    console.log("User: " + user_id +"List: "+ list_id + " - Videogame: " + videogame_id)

    const { error } = await supabase.from('list').update({'videogame_user_score': newScore}).match({list_id:list_id, user_id:user_id, videogame_id:videogame_id})

    if(error){
        console.log(error)
        return;
    }else{
        console.log("Score updated to: "+ newScore)
    }
}