"use server";
import { getSession } from "./getSession";
import { pool } from "@/util/postgres";

export default async function updateUser(prevState: any, formData: FormData) {
    const session = await getSession();
    const user_id = session.user_id;

    // Extract user data from form
    const user_name = formData.get("user_name") as string;
    const user_bio = formData.get("user_bio") as string;
    const user_email = formData.get("user_email") as string;
    const user_location = formData.get("user_location") as string;
    const user_webpage = formData.get("user_webpage") as string;
    const user_steam = formData.get("user_steam") as string;
    const user_twitch = formData.get("user_twitch") as string;
    const user_x = formData.get("user_x") as string;

    try {
        // Use parameterized query to prevent SQL injection
        await pool.query(
            `UPDATE users
             SET user_name = $1,
                 user_bio = $2,
                 user_email = $3,
                 user_location = $4,
                 user_webpage = $5,
                 user_steam = $6,
                 user_twitch = $7,
                 user_x = $8
             WHERE user_id = $9`,
            [user_name, user_bio, user_email, user_location, user_webpage, user_steam, user_twitch, user_x, user_id]
        );

        console.log("User settings updated successfully.");
        return "User settings updated successfully!";
    } catch (error) {
        console.error("Error updating user settings:", error);
        return "Error updating user settings.";
    }
}
