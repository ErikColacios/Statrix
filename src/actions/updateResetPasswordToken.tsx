"use server"
import { pool } from '@/util/postgres';

export default async function updateResetPasswordToken(token: string) {

    if (!token) {
        return { success: false, message: "No secure token found." };
    }

    try {
        // Check if the token exists and its not expired
        // Same expiration check as updateUserPassword
        const checkToken = await pool.query(`SELECT token_id
            FROM reset_password_tokens
            WHERE token = $1 AND expires_at >= NOW()`,
            [token]);

        if (checkToken.rows.length === 1) {
            return { success: true, message: "Access granted." };
        } else {
            return { success: false, message: "Unable to find this reset password token." };
        }

    } catch (error) {
        console.error("Error verifying email:", error);
        return { success: false, message: "Error verifying email." };
    }
}