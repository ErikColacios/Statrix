"use server";
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';
import { FriendshipStatus } from '../enums/FriendshipStatus';

export default async function updateUserFriendship(requester_id:string | undefined, addressee_id: string | undefined, status: FriendshipStatus) {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    if(requester_id === undefined)
        requester_id = userId
    if(addressee_id === undefined)
        addressee_id = userId

    try {
        await pool.query(
            `UPDATE user_friendships
             SET status = $1
             WHERE requester_id = $2 AND addressee_id = $3`,
            [status, requester_id, addressee_id]
        );

        return "User friendship updated successfully!";
    } catch (error) {
        console.error("Error updating user friendship:", error);
        return "Failed to update user friendship.";
    }
}
