"use server";
import { pool } from "@/util/postgres";

export default async function updateUserName(formData: FormData, userId:string) {
  const userNameLogIn = formData.get("usernameLogIn") as string;

  try {
    await pool.query(
      `UPDATE users SET user_name = $1 WHERE user_id = $2`,
      [userNameLogIn, userId],
    );
    
    return { response: "User name updated successfully!" };

  } catch (error) {
    console.error("Error updating user name:", error);
    return { error: "Something went wrong" };
  }
}
