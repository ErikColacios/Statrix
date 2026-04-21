"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getUserInfo from "./getUserInfo";

/**
 * Returns all the existing chat rooms where the session user is in with the information of every user
 * @returns messageRows
 */
export default async function getUserChatRooms() {
  try {
    const session:any = await getSessionUser();
    const userId: string = session.user.id as string;

    let query = "SELECT * FROM chat_rooms WHERE (user1_id = $1 OR user2_id = $1) ORDER BY room_id DESC";
    const { rows } = await pool.query(query, [userId]);

    let existingFriendChatRooms = []
    
    for (let i = 0; i < rows.length; i++) {
        let otherUser: any | undefined = [];

        if (String(userId) === String(rows[i].user1_id)) {
            otherUser = await getUserInfo(rows[i].user2_name);
        } else {
            otherUser = await getUserInfo(rows[i].user1_name);
        }
        const chatFriendInfo = {
            room_id: rows[i].room_id,
            user_id: otherUser[0].user_id,
            user_name: otherUser[0].user_name,
            avatar_image: otherUser[0].avatar_image,
            banner_image: otherUser[0].banner_image,
        }

        existingFriendChatRooms.push(chatFriendInfo)
    }

    return existingFriendChatRooms;
  } catch (error) {
    console.error("Error getting user chat rooms: " + error);
  }
}
