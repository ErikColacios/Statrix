"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { FriendshipStatus } from "@/enums/FriendshipStatus";

/**
 * Saves a swipe of the session user. If it's a like and the other user already liked the session user,
 * it's a match: both users become friends and a chat room is created for them.
 * @param targetId Id of the swiped user
 * @param liked true if the user swiped right (like), false if passed
 */
export default async function insertSwipe(targetId: string, liked: boolean): Promise<{ success: boolean, message: string, match: boolean, roomId?: string }> {
    const session: any = await getSessionUser();
    const userId: string | undefined = session?.user?.id;
    const userName: string | undefined = session?.user?.name;

    if (!userId || !userName) {
        return { success: false, message: "No user session found.", match: false };
    }
    if (!targetId || String(targetId) === String(userId)) {
        return { success: false, message: "Invalid user.", match: false };
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Both users must have matchmaking enabled
        const users = await client.query(
            `SELECT user_id, user_name FROM users WHERE user_id IN ($1, $2) AND matchmaking_enabled`,
            [userId, targetId]
        );
        const target = users.rows.find((u: any) => String(u.user_id) === String(targetId));
        if (users.rows.length < 2 || !target) {
            await client.query("ROLLBACK");
            return { success: false, message: "This user is not available for matchmaking.", match: false };
        }

        // Lock the pair of users, so if both like each other at the same time the match is detected only once
        const pairKey = [String(userId), String(targetId)].sort().join(":");
        await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [pairKey]);

        await client.query(
            `INSERT INTO user_swipes (swiper_id, target_id, liked) VALUES ($1, $2, $3)
             ON CONFLICT (swiper_id, target_id) DO UPDATE SET liked = EXCLUDED.liked, created_at = now()`,
            [userId, targetId, liked === true]
        );

        if (liked !== true) {
            await client.query("COMMIT");
            return { success: true, message: "Swipe saved.", match: false };
        }

        const reciprocal = await client.query(
            `SELECT 1 FROM user_swipes WHERE swiper_id = $1 AND target_id = $2 AND liked`,
            [targetId, userId]
        );
        if (reciprocal.rows.length === 0) {
            await client.query("COMMIT");
            return { success: true, message: "Swipe saved.", match: false };
        }

        // It's a match: the users become friends (unless one of them has blocked the other)
        const friendship = await client.query(
            `SELECT status FROM user_friendships
             WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
            [userId, targetId]
        );
        if (friendship.rows.some((f: any) => f.status === FriendshipStatus.BLOCKED)) {
            await client.query("COMMIT");
            return { success: true, message: "Swipe saved.", match: false };
        }
        if (friendship.rows.length > 0) {
            await client.query(
                `UPDATE user_friendships SET status = $3
                 WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
                [userId, targetId, FriendshipStatus.ACCEPTED]
            );
        } else {
            await client.query(
                `INSERT INTO user_friendships (requester_id, addressee_id, status, requester_name, addressee_name) VALUES ($1, $2, $3, $4, $5)`,
                [userId, targetId, FriendshipStatus.ACCEPTED, userName, target.user_name]
            );
        }

        // Get the chat room of the users, or create it
        let room = await client.query(
            `SELECT room_id FROM chat_rooms WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
            [userId, targetId]
        );
        if (room.rows.length === 0) {
            room = await client.query(
                `INSERT INTO chat_rooms (user1_id, user1_name, user2_id, user2_name) VALUES ($1, $2, $3, $4) RETURNING room_id`,
                [userId, userName, targetId, target.user_name]
            );
        }

        await client.query("COMMIT");
        return { success: true, message: "It's a match!", match: true, roomId: String(room.rows[0].room_id) };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error inserting swipe:", error);
        return { success: false, message: "Error saving the swipe.", match: false };
    } finally {
        client.release();
    }
}
