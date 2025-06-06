"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

    try {
        // Use parameterized query to prevent SQL injection
        await pool.query(
            `UPDATE users
             SET user_name = $1,
                 user_bio = $2,
                 user_email = $3,
                 user_location = $4,
                 user_webpage = $5
             WHERE user_id = $6`,
            [user_name, user_bio, user_email, user_location, user_webpage, user_id]
        );

        console.log("User updated successfully.");
        return "User updated successfully!";
    } catch (error) {
        console.error("Error updating user:", error);
        return "Error updating user.";
    }
}
