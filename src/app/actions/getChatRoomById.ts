"use server";
import { pool } from "@/util/postgres";

/**
 * Checks if there is an existing room with this room_id
 * @param usroom_ider_id 
 * @returns rows
 */
export default async function getChatRoomById(room_id:string) {
    const query =
      "SELECT * FROM chat_rooms WHERE (room_id = $1)";
    const { rows } = await pool.query(query, [room_id]);
    return rows;
}