"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export async function deleteUserFriendship(addressee_id: string) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    await pool.query(
      `DELETE FROM user_friendships
       WHERE (requester_id = $1 AND addressee_id = $2 OR requester_id = $2 AND addressee_id = $1);`,
      [userId, addressee_id]
    );
  } catch (error) {
    console.error("Error deleting friendship: ", error);
  }
}