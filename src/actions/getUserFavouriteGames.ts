import { pool } from "@/util/postgres";

/**
 * Gets the favourite games of the user.
 * @param user_name User name
 * @returns Fav games
 */
export async function getUserFavouriteGames(userName:string | undefined) {
    if (!userName) {
        console.warn("Parameter userName not found.");
        return 0;
    }

    try {
        const res = await pool.query(
            `SELECT game_id, game_name, game_base_image, favourite
             FROM user_videogame uv
             INNER JOIN users usr ON usr.user_id = uv.user_id
             WHERE favourite = true AND usr.user_name = $1
             ORDER BY hours_played DESC, score DESC
             LIMIT 5;`,
            [userName]
        );

        return res.rows;

    } catch (error) {
        console.error("Error fetching favourite games:", error);
        return 0;
    }
}
