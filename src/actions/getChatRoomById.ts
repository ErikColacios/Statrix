"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

/**
 * Checks if there is an existing room with this room_id and this session user
 * @param room_id
 * @returns messageRows
 */
export default async function getChatRoomById(room_id: string) {
  try {
    const session = await getSessionUser();
    const userId: string | undefined = session.user.id;
      
    let query = "SELECT * FROM chat_rooms WHERE room_id = $1 AND (user1_id = $2 OR user2_id = $2)";
    const { rows } = await pool.query(query, [room_id, userId]);

    return rows;

  } catch (error) {
    console.error("Error getting room data: " + error);
  }
}