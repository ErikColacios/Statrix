"use server";
import { pool } from "@/util/postgres";

/**
 * Checks if there is an existing room with this room_id, then returns the last messages of the conversation
 * @param room_id
 * @returns messageRows
 */
export default async function getChatRoomById(room_id: string) {
  let messages: Message[] = [];

  try {
    let query = "SELECT * FROM chat_rooms WHERE room_id = $1";
    const { rows } = await pool.query(query, [room_id]);

    if (rows.length > 0) {
      query = "SELECT * FROM chat_messages WHERE room_id = $1";
      const { rows } = await pool.query(query, [room_id]);

      rows.map((item: any) => {
        const message: Message = {
          senderId: item.sender_id,
          senderName: item.sender_name,
          text: item.text,
          created_at: item.created_at,
        };

        messages.push(message);
      });

      return messages;
    }
  } catch (error) {
    console.error("Error getting room data: " + error);
  }
}
