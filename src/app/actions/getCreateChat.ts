"use server";
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";

export default async function getCreateChat(user2_id: string | undefined) {
  const session = await getSession();
  const user_id: string | undefined = session.user_id;

  if (!user2_id) {
    throw new Error("The parameter user2_id is mandatory");
  }

  try {
    let rows = await checkChatRoom(user_id, user2_id)

    // If there is no existing room, we create it
    if (rows.length == 0) {
      await pool.query(
        `INSERT INTO chat_rooms (user1_id, user2_id) VALUES ($1, $2)`,
        [user_id, user2_id]
      );

      rows = await checkChatRoom(user_id, user2_id)
    }
    return rows;

  } catch (error) {
    console.error("Error getting a chat room:", error);
    throw error;
  }
}

/**
 * Checks if there is an existing room between the session user and user2
 * @param user_id 
 * @param user2_id 
 * @returns rows
 */
async function checkChatRoom(user_id: string | undefined, user2_id: string){
    const query =
      "SELECT * FROM chat_rooms WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)";
    const { rows } = await pool.query(query, [user_id, user2_id]);
    return rows;
}

