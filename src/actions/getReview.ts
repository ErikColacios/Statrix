"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

/**
 * Gets a single review with its author, game and likes.
 * @param reviewId Review id
 * @returns The review, or null if it does not exist or the query fails
 */
export default async function getReview(reviewId: string) {
    const session = await getSessionUser()
    const userId: string | null = (session?.user?.id as string) ?? null

    if (!reviewId) {
        return null;
    }

    try {
        // liked_by_user is always 0 when there is no session
        const { rows } = await pool.query(
            `SELECT rev.user_id, rev.game_id, rev.review_id, rev.user_name, rev.game_name, rev.game_base_image, rev.body, rev.review_date, rev.game_score,
                    usr.user_avatar, COUNT(revlikes.review_id) AS likes,
                    MAX(CASE WHEN revlikes.user_id = $1 THEN 1 ELSE 0 END) AS liked_by_user
             FROM reviews rev
             LEFT OUTER JOIN review_likes revlikes ON rev.review_id = revlikes.review_id
             LEFT OUTER JOIN users usr ON usr.user_id = rev.user_id
             WHERE rev.review_id = $2
             GROUP BY rev.user_id, rev.game_id, rev.review_id, rev.user_name, rev.game_name, rev.game_base_image, rev.body, rev.review_date, rev.game_score, usr.user_avatar`,
            [userId, reviewId]
        );

        return rows[0] ?? null;
    } catch (error) {
        // An invalid id (e.g. a typo in the URL) also ends here
        console.error("Error fetching review:", error);
        return null;
    }
}
