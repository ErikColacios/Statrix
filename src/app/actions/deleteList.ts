"use server";
import { pool } from '@/util/postgres';
import { redirect } from 'next/navigation';
import { getSession } from './getSession';

export async function deleteList(list_id: string) {
  const session = await getSession();
  const user_id = session.user_id;
  let redirectPath: string | null = null

  if (!user_id) {
    console.error("User session not found.");
    return;
  }

  const client = await pool.connect();
  try {
    // First we begin transaction
    await client.query('BEGIN');

    // Delete the user list
    const deleteRes = await client.query(
      `DELETE FROM list WHERE list_id = $1 AND user_id = $2 RETURNING *`,
      [list_id, user_id]
    );

    if (deleteRes.rowCount === 0) {
      throw new Error("No list found.");
    }

    // Update the number of lists of this user
    await client.query(
      `UPDATE users SET user_lists = user_lists - 1 WHERE user_id = $1`,
      [user_id]
    );

    // If everything went right, we commit the transaction
    await client.query('COMMIT');
    console.log(`List ${list_id} deleted successfully.`);
    redirectPath = '/mylists'

  } catch (error) {
    // If an error happened, we rollack the transaction
    await client.query('ROLLBACK');
    console.error("Error deleting list:", error);
  } finally {
    client.release();
    if(redirectPath)
      redirect(redirectPath)
  }
}