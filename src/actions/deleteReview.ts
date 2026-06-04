"use server";
import { pool } from "@/util/postgres";
import { redirect } from "next/navigation";
import getSessionUser from "./getSessionUser";

export async function deleteReview(reviewId: string, gameId: string, userIdReview: string) {
  const session = await getSessionUser();
  const userId = session.user.id;
  let redirectPath: string | null = null;

  if (!userId) {
    console.error("User session not found.");
    return;
  }

  if(userId !== userIdReview) {
    console.error("User is not the owner of this review.");
    return;
  }

  const client = await pool.connect();
  try {
    // First we begin transaction
    await client.query("BEGIN");

    // Delete the review likes
    await client.query(
      `DELETE FROM review_likessds WHERE review_id = $1 AND user_id = $2 AND videogame_id = $3`,
      [reviewId, userId, gameId]
    );

        // Delete the review
    const deleteReviewRes = await client.query(
      `DELETE FROM reviews WHERE review_id = $1 AND user_id = $2 AND videogame_id = $3 RETURNING *`,
      [reviewId, userId, gameId]
    );

    if (deleteReviewRes.rowCount === 0) {
      throw new Error("No review found.");
    }

    // If everything went right, we commit the transaction
    await client.query("COMMIT");
    redirectPath = "/gamePage/" + gameId;
  } catch (error) {
    // If an error happened, we rollack the transaction
    await client.query("ROLLBACK");
    console.error("Error deleting review:", error);
  } finally {
    client.release();
    //if (redirectPath) redirect(redirectPath);
  }
}
