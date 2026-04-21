"use server";
import { FriendshipStatus } from "../enums/FriendshipStatus";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";

export async function insertUserFriendship(addressee_id: string, addressee_name:string) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;
    const userName:string = session.user.name as string;

    await pool.query(
      `INSERT INTO user_friendships (requester_id, addressee_id, status, requester_name, addressee_name) VALUES ($1, $2, $3, $4, $5);`,
      [userId, addressee_id, FriendshipStatus.PENDING, userName, addressee_name]
    );
  } catch (error) {
    console.error("Error inserting user friendship: ", error);
  }
}