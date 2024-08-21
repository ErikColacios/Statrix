import { supabase } from "@/utils/supabase";

export default async function getUserGameStats(user_id:string) {

    let respone = {}

    // Counts the number of games played by the user
    async function getGamesPlayed(){
        const {count, error} = await supabase.from('user_videogame').select('videogame_id', {count: 'exact'}).match({user_id:user_id})
        if(error){
            console.log(error)
        }else{
            return count;
        }
    }

    // Gets the top 5 more scored games and most played by the user
    async function getTopGames(){
        const {data, error} = await supabase.from('user_videogame').select('videogame_id, videogame_name, score, hours_played, videogame_base_image').order('score', {ascending: false}).order('hours_played', {ascending: false}).limit(5).match({user_id:user_id})
        if(error){
            console.log(error)
        }else{
            return data;
        }
    }

    const gamesPlayed:number | null | undefined = await getGamesPlayed()
    const topGames:any = await getTopGames()

    respone = {"topGames": topGames,
                "gamesPlayed":gamesPlayed}

    return respone

}