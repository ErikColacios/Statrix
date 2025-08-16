"use server";
import { getSession } from "./getSession";
import { pool } from "@/util/postgres";

export default async function deleteLikeReview(review_id: string) {
  try {
    const session = await getSession();
    const user_id = session.user_id;

    await pool.query(
      `DELETE FROM public.review_likes WHERE review_id = $1 AND user_id = $2`,
      [review_id, user_id]
    );
  } catch (error) {
    console.error("Error deleting like:", error);
  }
}
