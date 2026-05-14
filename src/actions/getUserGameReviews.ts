"use server"
import { pool } from "@/util/postgres";

export default async function getUserGameReviews(userName:string) {
    
    if (!userName) {
        throw new Error("The parameter userName is mandatory");
    }

    try {
        const query = `
            SELECT rev.user_id, rev.videogame_id, rev.videogame_name, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, rev.game_base_image, COUNT(revlikes.review_id) AS likes
            FROM reviews rev
            LEFT OUTER JOIN review_likes revlikes ON rev.review_id = revlikes.review_id
            INNER JOIN users usr ON usr.user_id = rev.user_id
            WHERE rev.user_name = $1
            GROUP BY rev.user_id, rev.videogame_id, rev.videogame_name, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, rev.game_base_image
            ORDER BY review_date DESC
            LIMIT 1`;

        const { rows } = await pool.query(query, [userName]);
        return rows;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
}