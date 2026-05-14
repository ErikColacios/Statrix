"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function getUserVideogame(gameId: number) {
    const session:any = await getSessionUser();
    const userId: string = session?.user.id as string;

    if (!userId) {
        throw new Error("The parameter userId is mandatory");
    }
    else if (!gameId) {
        throw new Error("The parameter gameId is mandatory");
    }

    try {
        const query = `SELECT * FROM public.user_videogame WHERE user_id = $1 AND game_id = $2`;
        const { rows } = await pool.query(query, [userId, gameId]);

        return rows;
    } catch (error) {
        console.error("Error fetching user videogame info:", error);
        throw error;
    }
}