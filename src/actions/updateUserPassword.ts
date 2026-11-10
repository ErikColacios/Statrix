"use server";
import { pool } from "@/util/postgres";
import bcrypt from "bcryptjs";

/**
 * Changes the password of the user who owns a valid reset password token.
 * The email is taken from the token in the database, never from the client.
 * @param newPassword The new password
 * @param token The reset password token sent by email
 */
export default async function updateUserPassword(newPassword: string, token: string | undefined | null) {
  if (!newPassword || !token) {
    return { success: false, response: "Invalid password or reset link." };
  }

  try {
    // Check that the token exists and hasn't expired
    const checkToken = await pool.query(
      `SELECT token_id, user_email FROM reset_password_tokens WHERE token = $1 AND expires_at >= NOW()`,
      [token],
    );

    if (checkToken.rows.length !== 1) {
      return { success: false, response: "This reset link is not valid anymore." };
    }

    const { token_id: tokenId, user_email: userEmail } = checkToken.rows[0];

    // Before changing the password, we encrypt it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // And now we update it
    await pool.query(
      `UPDATE users SET user_password = $1 WHERE LOWER(user_email) = LOWER($2)`,
      [hashedPassword, userEmail],
    );

    // The token can only be used once, so we delete it from the 'reset_password_tokens' table
    await pool.query(
      `DELETE FROM reset_password_tokens WHERE token_id = $1`,
      [tokenId],
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
