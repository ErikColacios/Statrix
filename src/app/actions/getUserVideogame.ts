"use server"
import { pool } from "@/util/postgres";

export default async function getUserVideogame(user_id: string | undefined, videogame_id: string) {
    if (!user_id) {
        throw new Error("The parameter user_id is mandatory");
    }
    else if (!videogame_id) {
        throw new Error("The parameter videogame_id is mandatory");
    }

    try {
        const query = `SELECT * FROM public.user_videogame WHERE user_id = $1 AND videogame_id = $2`;
        const { rows } = await pool.query(query, [user_id, videogame_id]);

        return rows;
    } catch (error) {
        console.error("Error fetching user videogame info:", error);
        throw error;
    }
}