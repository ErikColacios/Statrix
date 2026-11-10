"use server"
import { pool } from "@/util/postgres";

export default async function getUserInfo(userName: string | undefined) {
    if (!userName) {
        throw new Error("The parameter userName is mandatory");
    }

    try {
        // Only public columns: this is a server action, so anyone can call it from the browser.
        // Private data of the logged user (email, Steam id...) comes from getSessionUserInfo
        const query = `SELECT user_id, user_name, user_lists, user_creationdate, user_bio, user_location, user_webpage,
                user_avatar, user_banner, user_steam_url, user_x, user_twitch,
                (SELECT COUNT(1) FROM user_friendships WHERE (requester_name = $1 OR addressee_name = $1) AND status = 'Accepted') as friends
            FROM users
            WHERE user_name = $1`;

        const { rows } = await pool.query(query, [userName]);
        return rows;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}