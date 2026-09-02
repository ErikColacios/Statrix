"use server"
import { pool } from '@/util/postgres';

export default async function updateEmailVerificationToken(token: string) {

    if (!token) {
        return { success: false, message: "No secure token found." };
    }

    try {
        // Check if the token exists and its not expired
        const checkToken = await pool.query(`SELECT token_id, user_id
            FROM email_verification_tokens
            WHERE token = $1 AND expires_at::date >= CURRENT_DATE AND created_at::date <= CURRENT_DATE`,
            [token]);

        if (checkToken.rows.length === 1) {

            const tokenId: string = checkToken.rows[0].token_id as string
            const userId: string = checkToken.rows[0].user_id as string

            // If the token exists, in the users table we set the email_verified field to true
            await pool.query(
                `UPDATE users SET user_email_verified = $1 WHERE user_id = $2`,
                [true, userId]
            );

            // And delete the token from the 'email_verification_tokens' table
            await pool.query(
                `DELETE FROM email_verification_tokens WHERE token_id = $1 AND user_id = $2 AND token = $3`,
                [tokenId, userId, token]
            );
        } else {
            return { success: false, message: "This email is aleady verified." };
        }

        return { success: true, message: "Email verified successfully." };
    } catch (error) {
        console.error("Error verifying email:", error);
        return { success: false, message: "Error verifying email." };
    }
}