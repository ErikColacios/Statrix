"use server";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";
import getUserVideogame from "./getUserVideogame";

export async function insertReview(
  gameId: number,
  gameName: string,
  reviewBody: string,
  gameImageId: string
) {
  try {
    const session: any = await getSessionUser();
    const userId: string = session.user.id as string;
    const userName: string = session.user.name as string;

    const userVideogame = await getUserVideogame(gameId);
    let gameScore: string = "NS"
    if(userVideogame) {
      gameScore = userVideogame.score as string;
    }

    const gameBaseImage: string = `https://images.igdb.com/igdb/image/upload/t_720p/${gameImageId}.png`;

    await pool.query(
      `INSERT INTO public.reviews (
          user_id, game_id, user_name, game_name, body, game_base_image, game_score)
          VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [userId, gameId, userName, gameName, reviewBody, gameBaseImage, gameScore],
    );
  } catch (error) {
    console.error("Error inserting review:", error);
  }
}
