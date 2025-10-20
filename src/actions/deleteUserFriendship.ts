"use server";
import { getSession } from "./getSession";
import { pool } from "@/util/postgres";

export async function deleteUserFriendship(addressee_id: string) {
  try {
    const session = await getSession();
    const user_id = session.user_id;

    await pool.query(
      `DELETE FROM user_friendships
       WHERE (requester_id = $1 AND addressee_id = $2 OR requester_id = $2 AND addressee_id = $1);`,
      [user_id, addressee_id]
    );
  } catch (error) {
    console.error("Error deleting friendship: ", error);
  }
}