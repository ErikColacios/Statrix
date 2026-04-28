"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";

export default async function updateUser(prevState: any, formData: FormData) {
    const session:any = await getSessionUser();
    const userId:string = session.user.id;

    // Extract user data from form
    const userName:string = formData.get("userName") as string;
    const userBio:string = formData.get("userBio") as string;
    const userEmail:string = formData.get("userEmail") as string;
    const userLocation:string = formData.get("userLocation") as string;
    const userWebpage:string = formData.get("userWebpage") as string;
    const userSteam:string = formData.get("userSteam") as string;
    const userTwitch:string = formData.get("userTwitch") as string;
    const userX:string = formData.get("userX") as string;

    try {
        // Use parameterized query to prevent SQL injection
        await pool.query(
            `UPDATE userswsws
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

    } catch (error) {
        console.error(error)
        return { error: "Error updating user settings"};
    }
}
