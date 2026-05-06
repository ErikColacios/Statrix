"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { ReviewMode } from "@/enums/ReviewMode";

export default async function getGameReviews(gameId:number, reviewMode:ReviewMode) {
    const session = await getSessionUser()
    const userId: string | undefined = session.user.id as string
    
    if (!userId) {
        throw new Error("The parameter user_id is mandatory");
    }
    else if (!gameId) {
        throw new Error("The parameter game_id is mandatory");
    }

    try {
        const query = `
            SELECT rev.user_id, rev.videogame_id, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, avi.avatar_image, COUNT(revlikes.review_id) AS likes,
            MAX(CASE WHEN revlikes.user_id = $1 THEN 1 ELSE 0 END) AS liked_by_user
            FROM reviews rev
            LEFT OUTER JOIN review_likes revlikes ON rev.review_id = revlikes.review_id
            LEFT OUTER JOIN users usr ON usr.user_id = rev.user_id
            INNER JOIN avatar_images avi ON avi.avatar_image_id = usr.user_avatar_id
            INNER JOIN banner_images bani ON bani.banner_image_id = usr.user_banner_id
            WHERE rev.videogame_id = $2
            GROUP BY rev.user_id, rev.videogame_id, rev.review_id, rev.user_name, rev.body, rev.recommended, rev.review_date, avi.avatar_image
            ${reviewMode === ReviewMode.POPULAR ? "ORDER BY likes DESC": "ORDER BY review_date DESC"}
             LIMIT 10`;

        const { rows } = await pool.query(query, [userId, gameId]);
        return rows;
    } catch (error) {
        console.error("Error fetching review:", error);
        throw error;
    }
}