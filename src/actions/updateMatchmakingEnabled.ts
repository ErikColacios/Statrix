"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

/**
 * Enables or disables matchmaking for the session user. Only users with matchmaking enabled
 * appear in the match page of other users.
 * @param enabled New value
 */
export default async function updateMatchmakingEnabled(enabled: boolean): Promise<{ success: boolean, message: string }> {
    const session: any = await getSessionUser();
    const userId: string | undefined = session?.user?.id;

    if (!userId) {
        return { success: false, message: "No user session found." };
    }

    try {
        await pool.query(`UPDATE users SET matchmaking_enabled = $1 WHERE user_id = $2`, [enabled === true, userId]);
        return { success: true, message: enabled ? "Matchmaking enabled." : "Matchmaking disabled." };
    } catch (error) {
        console.error("Error updating matchmaking:", error);
        return { success: false, message: "Error updating matchmaking." };
    }
}
