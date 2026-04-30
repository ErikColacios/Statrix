"use server";
import { pool } from "@/util/postgres";
import { redirect } from "next/navigation";
import getSessionUser from "./getSessionUser";

export async function deleteUser() {
  const session:any = await getSessionUser();
  const userId:string = session.user.id;
  let redirectPath: string | null = null;

  if (!userId) {
    console.error("User session not found.");
    return;
  }

  const client = await pool.connect();
  try {
    // First we begin transaction
    await client.query("BEGIN");

    // Delete the user list
    const deleteListRes = await client.query(
      `DELETE FROM list WHERE list_id = $1 AND user_id = $2 RETURNING *`,
      [list_id, user_id]
    );

    if (deleteListRes.rowCount === 0) {
      throw new Error("No list found.");
    }

    // Delete the list games
    const deleteListGamesRes = await client.query(
      `DELETE FROM list_games WHERE list_id = $1 RETURNING *`,
      [list_id]
    );

    if (deleteListGamesRes.rowCount === 0) {
      throw new Error("No games found in the list.");
    }

    // Update the number of lists of this user
    await client.query(
      `UPDATE users SET user_lists = user_lists - 1 WHERE user_id = $1`,
      [user_id]
    );

    // If everything went right, we commit the transaction
    await client.query("COMMIT");
    console.log(`List ${list_id} deleted successfully.`);
    redirectPath = "/mylists";
  } catch (error) {
    // If an error happened, we rollack the transaction
    await client.query("ROLLBACK");
    console.error("Error deleting list:", error);
  } finally {
    client.release();
    if (redirectPath) redirect(redirectPath);
  }
}
