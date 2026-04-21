"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";

export default async function insertLikeReview (review_id: string) {
    try {
      const session:any = await getSessionUser();
      const userId:string = session.user.id as string;

      await pool.query(
        `INSERT INTO public.review_likes (review_id, user_id) VALUES ($1, $2);`,
        [review_id, userId]
      );

    } catch (error) {
      console.error("Error inserting like:", error);
    }
}