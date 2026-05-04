"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export async function deleteUser(deleteAccountInput:string) {
  try {
    if(deleteAccountInput !== "DELETE ACCOUNT") {
      return { error: "Wrong input"};
    }
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;
    const userName:string = session.user.name as string;

    await pool.query(
      `DELETE FROM users
       WHERE user_id = $1`,
      [userId]
    );
    console.log("User deleted:" + userName + " - " + userId)
  } catch (error) {
    console.error("Error deleting user: ", error);
    return { error: "Error deleting user"};
  }
}