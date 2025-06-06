"use server";
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateUserAvatar(avatar_id: number, avatar_name: string) {
    const session = await getSession();
    const user_id = session.user_id;

    try {
        await pool.query(
            `UPDATE users
             SET user_avatar_id = $1, user_avatar = $2
             WHERE user_id = $3`,
            [avatar_id, avatar_name, user_id]
        );

        return "User avatar updated successfully!";
    } catch (error) {
        console.error("Error updating user avatar:", error);
        return "Failed to update user avatar.";
    }
}
