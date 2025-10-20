"use server";
import { getSession } from "./getSession";
import { pool } from "@/util/postgres";

export default async function insertLikeReview (review_id: string) {
    try {
      const session = await getSession();
      const user_id = session.user_id;

      await pool.query(
        `INSERT INTO public.review_likes (review_id, user_id) VALUES ($1, $2);`,
        [review_id, user_id]
      );

    } catch (error) {
      console.error("Error inserting like:", error);
    }
}