"use server"
import { pool } from "@/util/postgres";

export default async function getUserByEmail(email: string) {
    if (!email) {
        throw new Error("The parameter email is mandatory");
    }

    try {
        const countUsers = `SELECT COUNT(1)::int FROM users WHERE user_email = $1 AND user_email_verified = true AND user_google_id IS NULL`;
        const response = await pool.query(countUsers, [email]);

        return response.rows[0].count;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}