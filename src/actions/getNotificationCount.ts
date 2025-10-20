"use server";
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";
import { FriendshipStatus } from "../enums/FriendshipStatus";

export default async function getNotificationCount() {
  const session = await getSession();
  const user_id = session.user_id;

  try {
    // Get the number of PENDING requests that this user has received
    const query1 = `SELECT COUNT(1)
        FROM users usr
        INNER JOIN user_friendships uf ON uf.requester_id = usr.user_id
        WHERE uf.addressee_id = $1 AND uf.status = $2`;

    const count = await pool.query(query1, [user_id, FriendshipStatus.PENDING]);
    return count.rows[0].count;

  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
}
