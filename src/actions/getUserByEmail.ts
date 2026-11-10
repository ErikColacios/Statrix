// Server-only helper, NOT a server action on purpose: "use server" would make it callable from the browser
import { pool } from "@/util/postgres";
import normalizeEmail from "@/util/normalizeEmail";

export default async function getUserByEmail(email: string) {
    if (!email) {
        throw new Error("The parameter email is mandatory");
    }

    try {
        // Ignoring upper and lower case, like the rest of the email checks
        const countUsers = `SELECT COUNT(1)::int FROM users WHERE LOWER(user_email) = $1 AND user_email_verified = true AND user_google_id IS NULL`;
        const response = await pool.query(countUsers, [normalizeEmail(email)]);

        return response.rows[0].count;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}