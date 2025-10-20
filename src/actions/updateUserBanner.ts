"use server";
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateUserBanner(banner_id: number, banner_name: string) {
    const session = await getSession();
    const user_id = session.user_id;

    try {
        await pool.query(
            `UPDATE users
             SET user_banner_id = $1, user_banner = $2
             WHERE user_id = $3`,
            [banner_id, banner_name, user_id]
        );

        return "User banner updated successfully!";
    } catch (error) {
        console.error("Error updating user banner:", error);
        return "Failed to update user banner.";
    }
}
