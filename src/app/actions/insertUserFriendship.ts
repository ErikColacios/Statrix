"use server";
import { FriendshipStatus } from "../enums/FriendshipStatus";
import { getSession } from "./getSession";
import { pool } from "@/util/postgres";

export async function insertUserFriendship(addressee_id: string, addressee_name:string) {
  try {
    const session = await getSession();
    const user_id = session.user_id;
    const user_name = session.user_name;

    await pool.query(
      `INSERT INTO user_friendships (requester_id, addressee_id, status, requester_name, addressee_name) VALUES ($1, $2, $3, $4, $5);`,
      [user_id, addressee_id, FriendshipStatus.PENDING, user_name, addressee_name]
    );
  } catch (error) {
    console.error("Error inserting user friendship: ", error);
  }
}