"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function updateUserSteamId(steamId: string) {
    const session:any = await getSessionUser();
    const userId:string = session.user.id;

    try {
        await pool.query(
            `UPDATE users
             SET user_steam_id = $1
             WHERE user_id = $2`,
            [steamId, userId]
        );

    } catch (error) {
        console.error(error)
        return { error: "Error updating user steam id"};
    }
}