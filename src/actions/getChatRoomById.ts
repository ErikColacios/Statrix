"use server";
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";

/**
 * Checks if there is an existing room with this room_id and this session user
 * @param room_id
 * @returns messageRows
 */
export default async function getChatRoomById(room_id: string) {
  try {
    const session = await getSession();
    const user_id: string | undefined = session.user_id;
      
    let query = "SELECT * FROM chat_rooms WHERE room_id = $1 AND (user1_id = $2 OR user2_id = $2)";
    const { rows } = await pool.query(query, [room_id, user_id]);

    return rows;

  } catch (error) {
    console.error("Error getting room data: " + error);
  }
}
