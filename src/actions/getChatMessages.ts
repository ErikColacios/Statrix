"use server";
import { pool } from "@/util/postgres";
import getChatRoomById from "./getChatRoomById";

/**
 * Checks if there is an existing room with this room_id, then returns the last messages of the conversation
 * @param room_id
 * @returns messageRows
 */
export default async function getChatMessages(room_id: string, messages_offset:number) {
  let messages: Message[] = [];

  try {
    const chatRoomRows  = await getChatRoomById(room_id)

    if (chatRoomRows.length > 0) {
      // If the room exists, we return the message history
      // let query = `SELECT sub.* FROM 
      //               (SELECT * FROM chat_messages
      //               WHERE room_id = $1
      //               ORDER BY message_id DESC
      //               LIMIT 25 OFFSET $2) sub
      //             ORDER BY message_id ASC`;

      let query = `SELECT * FROM chat_messages
              WHERE room_id = $1
              ORDER BY message_id DESC
              LIMIT 25 OFFSET $2`;
      
      const { rows } = await pool.query(query, [room_id, messages_offset]);

      rows.map((item: any) => {
        const message: Message = {
          messageId: item.message_id,
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
    console.error("Error getting room messages: " + error);
  }
}
