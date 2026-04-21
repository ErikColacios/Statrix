"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function deleteLikeReview(review_id: string) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    await pool.query(
      `DELETE FROM public.review_likes WHERE review_id = $1 AND user_id = $2`,
      [review_id, userId]
    );
  } catch (error) {
    console.error("Error deleting like:", error);
  }
}
