"use server";
import { pool } from "@/util/postgres";

export default async function getUsersFriendshipAccepted(userId:string | undefined) {

  if (!userId) {
    throw new Error("The parameter userId is mandatory");
  }

  try {
    // Get the ACCEPTED requests that this user has RECEIVED or SENT
    const query1 = `SELECT usr.user_id, usr.user_name, uf.status, uf.created_at, uf.updated_at, uf.requester_id, uf.requester_name, uf.addressee_id, uf.addressee_name, usr.user_creationdate
        FROM users usr
        INNER JOIN user_friendships uf ON uf.requester_id = usr.user_id
        WHERE uf.status = 'Accepted' AND (uf.addressee_id = $1 OR uf.requester_id = $1)`;

    const friendships = await pool.query(query1, [userId]);

    return friendships.rows;

  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
}
