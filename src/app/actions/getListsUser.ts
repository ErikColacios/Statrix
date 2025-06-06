import { SessionData } from "@/session_lib";
import { pool } from "@/util/postgres";
import { IronSession } from "iron-session";

/**
 * Retrieves all lists created by the user associated with the session.
 * @param session IronSession containing user_id
 * @returns List of user-created lists, ordered by creation date
 */
export async function getListsUser(session: IronSession<SessionData>) {
    if (!session?.user_id) {
        console.warn("No user session found.");
        return { success: false, message: "User not logged in." };
    }

    try {
        const res = await pool.query(
            `SELECT list_id, list_name, list_creationdate 
             FROM list
             WHERE user_id = $1
             GROUP BY list_id, list_name, list_creationdate 
             ORDER BY list_creationdate DESC`,
            [session.user_id]
        );

        return res.rows;
    } catch (error) {
        console.error("Error fetching user lists:", error);
        return { success: false, message: "Error fetching lists." };
    }
}
