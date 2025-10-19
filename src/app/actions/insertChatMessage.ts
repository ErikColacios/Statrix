"use server";
import { pool } from "@/util/postgres";

export default async function insertChatMessage(
  roomId: string,
  senderId: string | undefined,
  senderName: string | undefined,
  text: string
) {
  try {
    if (!roomId || !senderId) {
      console.error("Room id and sender id not found");
      return;
    }
    console.log("hasta aqui llega")

    console.log(process.env.POSTGRES_URL)
    
    await pool.query(
      `INSERT INTO chat_messages (room_id, sender_id, sender_name, text) VALUES ($1, $2, $3, $4);`,
      [roomId, senderId, senderName, text]
    );
  } catch (error) {
    console.error("Error inserting chat message:", error);
  }
}
