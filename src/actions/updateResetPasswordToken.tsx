"use server"
import { pool } from '@/util/postgres';

export default async function updateResetPasswordToken(token: string) {

    if (!token) {
        return { success: false, message: "No secure token found." };
    }

    try {
        // Check if the token exists and its not expired
        const checkToken = await pool.query(`SELECT token_id, user_email
            FROM reset_password_tokens
            WHERE token = $1 AND expires_at::date >= CURRENT_DATE AND created_at::date <= CURRENT_DATE`,
            [token]);

        if (checkToken.rows.length === 1) {
            const tokenId: string = checkToken.rows[0].token_id as string
            const userEmail: string = checkToken.rows[0].user_email as string

            return { success: true, message: "Access granted.", email: userEmail, tokenId: tokenId};

        } else {
            return { success: false, message: "Unable to find this reset password token.", email: null, tokenId: null };
        }

    } catch (error) {
        console.error("Error verifying email:", error);
        return { success: false, message: "Error verifying email.", email: null, tokenId: null };
    }
}