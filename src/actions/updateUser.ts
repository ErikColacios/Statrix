"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";
import normalizeEmail from "@/util/normalizeEmail";

export default async function updateUser(prevState: any, formData: FormData) {
    const session:any = await getSessionUser();
    const userId:string | undefined = session?.user?.id;

    if (!userId) {
        return { error: "No user session found." };
    }

    // Extract user data from form
    const userName:string = ((formData.get("userName") as string) ?? "").trim();
    const userBio:string = formData.get("userBio") as string;
    let userEmail:string = normalizeEmail(formData.get("userEmail") as string);
    const userLocation:string = formData.get("userLocation") as string;
    const userWebpage:string = formData.get("userWebpage") as string;
    const userSteam:string = formData.get("userSteam") as string;
    const userTwitch:string = formData.get("userTwitch") as string;
    const userX:string = formData.get("userX") as string;

    if (userName === "" || userName.includes(" ")) {
        return { error: "The user name must not be empty or contain whitespaces" };
    }

    try {
        // Google users can't change their email: it's the one of their Google account
        const currentUser = await pool.query(`SELECT user_email, user_google_id FROM users WHERE user_id = $1`, [userId]);
        if (currentUser.rows[0]?.user_google_id) {
            userEmail = normalizeEmail(currentUser.rows[0].user_email);
        }

        if (userEmail === "") {
            return { error: "The email must not be empty" };
        }

        // The user name and the email can't be used by another account (ignoring upper and lower case)
        const existingUsers = await pool.query(
            `SELECT LOWER(user_name) = LOWER($1) AS same_name, LOWER(user_email) = $2 AS same_email
             FROM users
             WHERE user_id <> $3 AND (LOWER(user_name) = LOWER($1) OR LOWER(user_email) = $2)`,
            [userName, userEmail, userId]
        );
        if (existingUsers.rows.some((row: any) => row.same_name)) {
            return { error: "This user name is already taken" };
        }
        if (existingUsers.rows.some((row: any) => row.same_email)) {
            return { error: "This email is already used by another account" };
        }

        // Use parameterized query to prevent SQL injection
        await pool.query(
            `UPDATE users
             SET user_name = $1,
                 user_bio = $2,
                 user_email = $3,
                 user_location = $4,
                 user_webpage = $5,
                 user_steam_url = $6,
                 user_twitch = $7,
                 user_x = $8
             WHERE user_id = $9`,
            [userName, userBio, userEmail, userLocation, userWebpage, userSteam, userTwitch, userX, userId]
        );

    } catch (error: any) {
        // 23505 = unique violation: the email was taken by another account at the same time
        if (error?.code === "23505") {
            return { error: "This user name or email is already used by another account" };
        }
        console.error(error)
        return { error: "Error updating user settings"};
    }
}
