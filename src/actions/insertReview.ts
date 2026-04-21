"use server";
import { getSession } from "./getSessionUser";
import { pool } from "@/util/postgres";

export async function insertReview(
  game_id: string,
  game_name: string,
  reviewBody: string,
  recommended: string
) {
  try {
    const session = await getSession();
    const user_id = session.user_id;
    const user_name = session.user_name;

    await pool.query(
      `INSERT INTO public.reviews (
          user_id, videogame_id, user_name, videogame_name, body, recommended)
          VALUES ($1, $2, $3, $4, $5, $6);`,
      [user_id, game_id, user_name, game_name, reviewBody, recommended]
    );
  } catch (error) {
    console.error("Error inserting review:", error);
  }
}
