"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function getUserVideogameAll() {
    const session:any = await getSessionUser();
    const userId: string = session?.user.id as string;

    if (!userId) {
        throw new Error("The parameter userId is mandatory");
    }

    try {
        const query = `SELECT * FROM public.user_videogame WHERE user_id = $1 ORDER BY score DESC, hours_played DESC, game_name ASC`;
        const { rows } = await pool.query(query, [userId]);

        return rows;
    } catch (error) {
        console.error("Error fetching user videogame info:", error);
        throw error;
    }
}