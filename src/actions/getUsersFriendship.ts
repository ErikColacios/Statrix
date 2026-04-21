"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { FriendshipStatus } from "../enums/FriendshipStatus";

export default async function getUsersFriendship(userSearchMode: FriendshipStatus) {
  const session:any = await getSessionUser();
  const userId:string = session.user.id as string;

  if (!userSearchMode) {
    throw new Error("The parameter userSearched is mandatory");
  }

  try {
    // Get the requests that this user has RECEIVED
    const query1 = `SELECT usr.user_id, usr.user_name, avi.avatar_image, uf.status, uf.created_at, uf.updated_at, uf.requester_id, uf.requester_name, usr.user_creationdate
        FROM users usr
        INNER JOIN user_friendships uf ON uf.requester_id = usr.user_id
        INNER JOIN avatar_images avi ON usr.user_avatar_id = avi.avatar_image_id
        WHERE uf.addressee_id = $1 AND uf.status = $2`;

    const receivedRequests = await pool.query(query1, [userId, userSearchMode]);

    // Get the requests that this user has SENT
    const query2 = `SELECT usr.user_id, usr.user_name, avi.avatar_image, uf.status, uf.created_at, uf.updated_at, uf.requester_id, uf.requester_name, usr.user_creationdate
        FROM users usr
        INNER JOIN user_friendships uf ON uf.addressee_id = usr.user_id
        INNER JOIN avatar_images avi ON usr.user_avatar_id = avi.avatar_image_id
        WHERE uf.requester_id = $1 AND uf.status = $2`;
    const sentRequests = await pool.query(query2, [userId, userSearchMode]);
    
    // This object divides friend requests by RECEVIED, SENT and ALL together
    const receivedAndSentRequests = {
      received: receivedRequests.rows,
      sent: sentRequests.rows,
      all: [...receivedRequests.rows, ...sentRequests.rows]
    }

    return receivedAndSentRequests;

  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
}
