"use server"
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

/**
 * Gets the info of the logged user, including private data (email, Steam id...) that getUserInfo doesn't return.
 * The user always comes from the session, so nobody can get the private data of another user.
 * The password is never returned.
 */
export default async function getSessionUserInfo() {
    const session: any = await getSessionUser();
    const userId: string | undefined = session?.user?.id;

    if (!userId) {
        return [];
    }

    try {
        const query = `SELECT user_id, user_name, user_email, user_lists, user_creationdate, user_bio, user_location, user_webpage,
                user_avatar, user_banner, user_steam_url, user_x, user_twitch, user_google_id, user_steam_id,
                (SELECT COUNT(1) FROM user_friendships WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'Accepted') as friends
            FROM users
            WHERE user_id = $1`;

        const { rows } = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error("Error fetching session user info:", error);
        throw error;
    }
}
