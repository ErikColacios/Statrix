"use server";
import { pool } from "@/util/postgres";
import bcrypt from "bcryptjs";

export default async function updateUserPassword(newPassword: string, userEmail: string | undefined | null, tokenId: string | undefined | null ) {
  try {
    // Before changing the password, we encrypt it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // And now we update it
    await pool.query(
      `UPDATE users SET user_password = $1 WHERE user_email = $2`,
      [hashedPassword, userEmail],
    );

    // If the token exists, we delete the token from the 'reset_password_tokens' table
    await pool.query(
      `DELETE FROM reset_password_tokens WHERE token_id = $1 AND user_email = $2`,
      [tokenId, userEmail],
    );

    return { success: true, response: "User password changed successfully!" };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      response: "Somethign went wrong. Try again later.",
    };
  }
}
