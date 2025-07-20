"use server"
import { pool } from "@/util/postgres";
import { Status } from "../enums/Status";

type GameGlobalStats = {
    globalPlaying:number,
    globalCompleted:number,
    globalFavourite:number
}

export default async function getGlobalUserVideogame(videogame_id: string) {

    if (!videogame_id) {
        throw new Error("The parameter videogame_id is mandatory");
    }

    try {
        const query1 = `select COUNT(1)::int from user_videogame WHERE videogame_id = $1 and status=$2`;
        const count1 = await pool.query(query1, [videogame_id, Status.PLAYING]);

        const query2 = `select COUNT(1)::int from user_videogame WHERE videogame_id = $1 and status=$2`;
        const count2 = await pool.query(query2, [videogame_id, Status.COMPLETED]);

        const query3 = `select COUNT(1)::int from user_videogame WHERE videogame_id = $1 and favourite=$2`;
        const count3 = await pool.query(query3, [videogame_id, true]);

        const globalStats:GameGlobalStats[] = [count1.rows[0].count, count2.rows[0].count, count3.rows[0].count]

        return globalStats;

    } catch (error) {
        console.error("Error fetching user videogame info:", error);
        throw error;
    }

    
}