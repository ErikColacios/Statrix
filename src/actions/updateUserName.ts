"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

/**
 * Changes the user name of the logged user (used in /newUser).
 * The user always comes from the session, never from the client.
 */
export default async function updateUserName(formData: FormData) {
  const session: any = await getSessionUser();
  const userId: string | undefined = session?.user?.id;
  const userNameLogIn = ((formData.get("usernameLogIn") as string) ?? "").trim();

  if (!userId) {
    return { error: "No user session found." };
  }

  if (userNameLogIn === "" || userNameLogIn.includes(" ")) {
    return { error: "The user name must not be empty or contain whitespaces" };
  }

  try {
    // The user name can't be used by another account (ignoring upper and lower case)
    const existingUser = await pool.query(
      `SELECT user_id FROM users WHERE LOWER(user_name) = LOWER($1) AND user_id <> $2`,
      [userNameLogIn, userId],
    );
    if (existingUser.rows.length > 0) {
      return { error: "This user name is already taken" };
    }

    await pool.query(
      `UPDATE users SET user_name = $1 WHERE user_id = $2`,
      [userNameLogIn, userId],
    );

    return { response: "User name updated successfully!" };

  } catch (error) {
    console.error("Error updating user name:", error);
    return { error: "Something went wrong" };
  }
}
