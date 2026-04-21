"use server";
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';

export default async function updateUserBanner(banner_id: number, banner_name: string) {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    try {
        await pool.query(
            `UPDATE users
             SET user_banner_id = $1, user_banner = $2
             WHERE user_id = $3`,
            [banner_id, banner_name, userId]
        );

        return "User banner updated successfully!";
    } catch (error) {
        console.error("Error updating user banner:", error);
        return "Failed to update user banner.";
    }
}
