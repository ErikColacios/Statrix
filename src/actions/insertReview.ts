"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";

export async function insertReview(
  gameId: number,
  gameName: string,
  reviewBody: string,
  recommended: string,
  gameImageId: string
) {
  try {
    const session: any = await getSessionUser();
    const userId: string = session.user.id as string;
    const userName: string = session.user.name as string;

    const gameBaseImage: string = `https://images.igdb.com/igdb/image/upload/t_720p/${gameImageId}.png`;

    await pool.query(
      `INSERT INTO public.reviews (
          user_id, videogame_id, user_name, videogame_name, body, recommended, game_base_image)
          VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [userId, gameId, userName, gameName, reviewBody, recommended, gameBaseImage],
    );
  } catch (error) {
    console.error("Error inserting review:", error);
  }
}
