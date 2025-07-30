"use server"
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";
import { ReviewMode } from '@/app/enums/ReviewMode'

export default async function getGameReviews(game_id:string, reviewMode:ReviewMode) {
    const session = await getSession()
    const user_id: string | undefined = session.user_id
    
    if (!user_id) {
        throw new Error("The parameter user_id is mandatory");
    }
    else if (!game_id) {
        throw new Error("The parameter game_id is mandatory");
    }

    try {
        const query = `
            SELECT * FROM user_reviews
            WHERE videogame_id = $1
            ${reviewMode === ReviewMode.POPULAR ? "ORDER BY likes DESC": "ORDER BY review_date DESC"}`;

        const { rows } = await pool.query(query, [game_id]);
        return rows;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
}