"use server"
import { pool } from "@/util/postgres";
import { GameStatus } from "../enums/GameStatus";

type GameGlobalStats = {
    globalPlaying:number,
    globalCompleted:number,
    globalFavourite:number
}

export default async function getGlobalUserVideogame(game_id: string) {

    if (!game_id) {
        throw new Error("The parameter game_id is mandatory");
    }

    try {
        const query1 = `select COUNT(1)::int from user_videogame WHERE game_id = $1 and status = $2`;
        const count1 = await pool.query(query1, [game_id, GameStatus.PLAYING]);

        const query2 = `select COUNT(1)::int from user_videogame WHERE game_id = $1 and status = $2`;
        const count2 = await pool.query(query2, [game_id, GameStatus.COMPLETED]);

        const query3 = `select COUNT(1)::int from user_videogame WHERE game_id = $1 and favourite = $2`;
        const count3 = await pool.query(query3, [game_id, true]);

        const globalStats:GameGlobalStats[] = [count1.rows[0].count, count2.rows[0].count, count3.rows[0].count]

        return globalStats;

    } catch (error) {
        console.error("Error fetching user videogame info:", error);
        throw error;
    }

    
}