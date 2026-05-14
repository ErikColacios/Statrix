"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";

export async function insertReview(
  gameId: number,
  gameName: string,
  reviewBody: string,
  recommended: string
) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;
    const userName:string = session.user.name as string;

    await pool.query(
      `INSERT INTO public.reviews (
          user_id, videogame_id, user_name, videogame_name, body, recommended)
          VALUES ($1, $2, $3, $4, $5, $6);`,
      [userId, gameId, userName, gameName, reviewBody, recommended]
    );
  } catch (error) {
    console.error("Error inserting review:", error);
  }
}
