"use server"
import { pool } from "@/util/postgres";
import { UserCard } from "@/types/UserCard";

/**
 * Gets the public info shown in the user hover card. Only public columns are selected,
 * because server actions can be called from the browser.
 * @param userName User name
 */
export default async function getUserCard(userName: string): Promise<{ success: boolean, message: string, user?: UserCard }> {
    if (!userName) {
        return { success: false, message: "The parameter userName is mandatory" };
    }

    try {
        const { rows } = await pool.query(
            `SELECT user_id, user_name, user_bio, user_avatar, user_banner, user_location, user_creationdate
             FROM users
             WHERE user_name = $1`,
            [userName]
        );

        if (rows.length === 0) {
            return { success: false, message: "User not found." };
        }

        return { success: true, message: "User found.", user: rows[0] };
    } catch (error) {
        console.error("Error fetching user card:", error);
        return { success: false, message: "Error fetching user card." };
    }
}
