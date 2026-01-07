"use server";
import { pool } from "@/util/postgres";

export default async function getUsersFriendshipAccepted(user_name:string | undefined) {

  if (!user_name) {
    throw new Error("The parameter user_name is mandatory");
  }

  try {
    // Get the ACCEPTED requests that this user has RECEIVED or SENT
    const query1 = `SELECT usr.user_id, usr.user_name, avi.avatar_image, uf.status, uf.created_at, uf.updated_at, uf.requester_id, uf.requester_name, uf.addressee_name, usr.user_creationdate
        FROM users usr
        INNER JOIN user_friendships uf ON uf.requester_id = usr.user_id
        INNER JOIN avatar_images avi ON usr.user_avatar_id = avi.avatar_image_id
        WHERE uf.status = 'Accepted' AND (uf.addressee_name = $1 OR uf.requester_name = $1)`;

    const friendships = await pool.query(query1, [user_name]);

    return friendships;

  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
}
