import { pool } from "@/util/postgres";

export default async function getUserGameStats(user_id:string) {

    let respone = {}

    async function getGamesPlayed(){
     const res = await pool.query(`SELECT COUNT(*) FROM user_videogame WHERE user_id='${user_id}'`);
     return res.rows[0].count
    }

    // Gets the top 5 more scored games and most played by the user
    async function getTopGames(){
        try{
            const res = await pool.query(`SELECT videogame_id, videogame_name, score, hours_played, videogame_base_image
                FROM user_videogame 
                WHERE user_id='${user_id}'
                ORDER BY score DESC, hours_played DESC
                LIMIT 5`);
                console.log(res.rows)
            return res.rows;
        }catch(error){
            console.log(error)
        }
    }

    const gamesPlayed:number | null | undefined = await getGamesPlayed()
    const topGames:any = await getTopGames()

    respone = {"topGames": topGames,
                "gamesPlayed":gamesPlayed}

    return respone;
}