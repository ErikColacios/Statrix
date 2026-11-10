// Server-only helper, NOT a server action on purpose: "use server" would make it callable from the browser
import { pool } from '@/util/postgres';
import { v4 as uuid } from "uuid";
import normalizeEmail from '@/util/normalizeEmail';

/**
 * Logs in (or signs up) a user with Google.
 * @param userGoogleId Google account id
 * @param email Email of the Google account
 * @param emailVerified If Google says the email belongs to this Google account
 * @returns The user data, or null to reject the login
 */
export async function logInUserGoogle(userGoogleId:string, email:string, emailVerified:boolean = false) {

    const userEmail: string = normalizeEmail(email);
    let isNewUser = false;

    try {
        // 1. A user that already logged in with this Google account
        const res = await pool.query(
            `SELECT user_id, user_name FROM users WHERE user_google_id = $1`,
            [userGoogleId]
        )

        if (res.rows.length === 1) {
            return { userId: res.rows[0].user_id, userName: res.rows[0].user_name, isNewUser: isNewUser }
        }

        // 2. An account created with email and password that uses the same email
        const existingEmail = await pool.query(
            `SELECT user_id, user_name, user_google_id FROM users WHERE LOWER(user_email) = $1`,
            [userEmail]
        )

        if (existingEmail.rows.length > 0) {
            const existingUser = existingEmail.rows[0]

            // We only link both accounts if Google confirms that the email is really theirs,
            // otherwise anyone could get into an account just by using its email
            if (!emailVerified || existingUser.user_google_id) {
                console.warn("Google login rejected: the email is already used by another account.");
                return null;
            }

            await pool.query(
                `UPDATE users SET user_google_id = $1, user_email_verified = true WHERE user_id = $2`,
                [userGoogleId, existingUser.user_id]
            );

            return { userId: existingUser.user_id, userName: existingUser.user_name, isNewUser: isNewUser }
        }

        // 3. A new user: we create it with a temporary user name, that the user chooses in /newUser
        isNewUser = true;
        const userId = uuid();
        const userName:string = 'User'+userGoogleId;
        const userBio:string = "Welcome to my profile!"
        const userLocation:string = "No mans land"

        await pool.query(
        `INSERT INTO users (
            user_id, user_name, user_email, user_bio, user_location, user_google_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, userName, userEmail, userBio, userLocation, userGoogleId]
        );

        return { userId, userName, isNewUser }

    } catch (error) {
        // If something fails we return null, so the signIn callback can reject the login
        console.error("Error logging in with Google:", error);
        return null;
    }
}
