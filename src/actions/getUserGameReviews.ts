"use server"
import { pool } from "@/util/postgres";

export default async function getUserGameReviews(user_name:string) {
    
    if (!user_name) {
        throw new Error("The parameter user_name is mandatory");
    }

    try {
        const query = `
            SELECT rev.user_id, rev.videogame_id, rev.videogame_name, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, uv.game_base_image, COUNT(revlikes.review_id) AS likes
            FROM reviews rev
            LEFT OUTER JOIN review_likes revlikes ON rev.review_id = revlikes.review_id
            LEFT OUTER JOIN user_videogame uv ON uv.user_id = rev.user_id AND uv.game_id = rev.videogame_id
            WHERE rev.user_name = $1
            GROUP BY rev.user_id, rev.videogame_id, rev.videogame_name, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, uv.game_base_image
            ORDER BY review_date DESC
            LIMIT 1`;

        const { rows } = await pool.query(query, [user_name]);
        return rows;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
}