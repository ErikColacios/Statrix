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
            SELECT rev.user_id, rev.videogame_id, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, COUNT(revlikes.review_id) AS likes,
            MAX(CASE WHEN revlikes.user_id = $1 THEN 1 ELSE 0 END) AS liked_by_user
            FROM reviews rev
            LEFT OUTER JOIN review_likes revlikes ON rev.review_id = revlikes.review_id
            WHERE rev.videogame_id = $2
            GROUP BY rev.user_id, rev.videogame_id, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date
            ${reviewMode === ReviewMode.POPULAR ? "ORDER BY likes DESC": "ORDER BY review_date DESC"}`;

        const { rows } = await pool.query(query, [user_id, game_id]);
        return rows;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
}