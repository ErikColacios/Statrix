"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function getCreateChat(user2_id: string | undefined, user2_name:string) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;
  const userName: string = session.user.name as string;

  if (!user2_id) {
    throw new Error("The parameter user2_id is mandatory");
  }

  try {
    let rows = await checkChatRoom(userId, user2_id)

    // If there is no existing room, we create it
    if (rows.length == 0) {
      await pool.query(
        `INSERT INTO chat_rooms (user1_id, user1_name, user2_id, user2_name) VALUES ($1, $2, $3, $4)`,
        [userId, userName, user2_id, user2_name]
      );

      rows = await checkChatRoom(userId, user2_id)
    }
    return rows;

  } catch (error) {
    console.error("Error getting a chat room:", error);
    throw error;
  }
}

/**
 * Checks if there is an existing room between the session user and user2
 * @param userId 
 * @param userId2 
 * @returns rows
 */
async function checkChatRoom(userId: string | undefined, userId2: string){
    const query = "SELECT * FROM chat_rooms WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)";
    const { rows } = await pool.query(query, [userId, userId2]);
    return rows;
}

