"use server"
import { pool } from '@/util/postgres';
import { v4 as uuid } from "uuid";

export default async function insertEmailVerificationToken(userId: string, token: string) {
    if (!token) {
        return { success: false, message: "No secure token found." };
    }

    try {
        const tokenId = uuid();
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 86400000);

        await pool.query(
            `INSERT INTO public.email_verification_tokens (token_id, user_id, token, created_at, expires_at) VALUES ($1, $2, $3, $4, $5);`,
            [tokenId, userId, token, createdAt, expiresAt]);
    } catch (error) {
        console.error("Error inserting email verification token:", error);
        return { success: false, message: "Error inserting email verification token." };
    }
}