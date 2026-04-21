"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";

export default async function updateUser(prevState: any, formData: FormData) {
    const session:any = await getSessionUser();
    const userId:string = session.user.id;

    // Extract user data from form
    const userName:string = formData.get("user_name") as string;
    const userBio:string = formData.get("user_bio") as string;
    const userEmail:string = formData.get("user_email") as string;
    const userLocation:string = formData.get("user_location") as string;
    const userWebpage:string = formData.get("user_webpage") as string;
    const userSteam:string = formData.get("user_steam") as string;
    const userTwitch:string = formData.get("user_twitch") as string;
    const userX:string = formData.get("user_x") as string;

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
            [userName, userBio, userEmail, userLocation, userWebpage, userSteam, userTwitch, userX, userId]
        );

        console.log("User settings updated successfully.");
        return "User settings updated successfully!";
    } catch (error) {
        console.error("Error updating user settings:", error);
        return "Error updating user settings.";
    }
}
