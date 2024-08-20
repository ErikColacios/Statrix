"use server"
import { supabase } from '../../utils/supabase'
import { getSession } from './getSession';

export default async function updateHoursPlayed(list_id:string, videogame_id:string, newHoursPlayed:number){
    const session = await getSession()
    const user_id = session.user_id

    console.log("User: " + user_id +"List: "+ list_id + " - Videogame: " + videogame_id)

    const { error } = await supabase.from('user_videogame').update({'hours_played': newHoursPlayed}).match({user_id:user_id, videogame_id:videogame_id})

    if(error){
        console.log(error)
        return;
    }else{
        console.log("Hours played updated to: "+ newHoursPlayed)
    }
}