// Server-only helper, NOT a server action on purpose: "use server" would make it callable from the browser
import { pool } from '@/util/postgres';
import { v4 as uuid } from "uuid";

// The user is checked before in sendEmailResetPassword, which is the only place that calls this function
export default async function insertResetPasswordToken(email: string, token: string) {
    if (!token) {
        return { success: false, message: "No secure token found." };
    }

    try {
        const tokenId = uuid();
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 86400000);

        await pool.query(
            `INSERT INTO public.reset_password_tokens (token_id, user_email, token, created_at, expires_at) VALUES ($1, $2, $3, $4, $5);`,
            [tokenId, email, token, createdAt, expiresAt]);

        return { success: true, message: "Password reset token created." };
    } catch (error) {
        console.error("Error inserting reset password token:", error);
        return { success: false, message: "Error sending a reset link to this email. Try again later." };
    }
}