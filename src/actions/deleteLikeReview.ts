"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

export default async function deleteLikeReview(reviewId: string, gameId:number) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    await pool.query(
      `DELETE FROM public.review_likes WHERE review_id = $1 AND user_id = $2 AND videogame_id=$3`,
      [reviewId, userId, gameId]
    );
  } catch (error) {
    console.error("Error deleting like:", error);
  }
}
