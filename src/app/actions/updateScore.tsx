"use server"
import { supabase } from '../../utils/supabase'
import { getSession } from './getSession';

export default async function updateScore(videogame_id:string, newScore:string){
    const session = await getSession()
    const user_id = session.user_id

    console.log("User: " + user_id + "- Videogame: " + videogame_id)

    const { error } = await supabase.from('user_videogame').update({'score': newScore}).match({user_id:user_id, videogame_id:videogame_id})

    if(error){
        console.log(error)
        return;
    }else{
        console.log("Score updated to: "+ newScore)
    }
}