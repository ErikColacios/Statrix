"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export async function deleteReview(reviewId: string, gameId: string, userIdReview: string) {
  const session = await getSessionUser();
  const userId = session.user.id;

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
      `DELETE FROM review_likes WHERE review_id = $1 AND user_id = $2 AND videogame_id = $3`,
      [reviewId, userId, gameId]
    );

        // Delete the review
    await client.query(
      `DELETE FROM reviews WHERE review_id = $1 AND user_id = $2 AND videogame_id = $3 RETURNING *`,
      [reviewId, userId, gameId]
    );

    // If everything went right, we commit the transaction
    await client.query("COMMIT");
  } catch (error) {
    // If an error happened, we rollack the transaction
    await client.query("ROLLBACK");
    throw "There was an error deleting this review.";
  } finally {
    client.release();
  }
}
