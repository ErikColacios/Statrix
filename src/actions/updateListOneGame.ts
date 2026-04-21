"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { GameStatus } from "@/enums/GameStatus";

export default async function updateListOneGame(
  listId: string,
  gameId: string,
  gameName: string,
  imageId: string
) {
  const session:any = await getSessionUser();
  const userId:string = session.user.id as string;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert the new game in 'list_games'
    const game_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${imageId}.png`;

    await client.query(
      `INSERT INTO list_games (
                    list_id, game_id, game_name, game_base_image
                ) VALUES ($1, $2, $3, $4)`,
      [listId, gameId, gameName, game_base_image]
    );
    // Insert into 'user_videogame' if not already present
    await client.query(
      `INSERT INTO user_videogame (
                    user_id, game_id, score, hours_played, game_name, game_base_image, status
                ) VALUES ($1, $2, 0, 0, $3, $4, $5)
                ON CONFLICT (user_id, game_id) DO NOTHING`,
      [userId, gameId, gameName, game_base_image, GameStatus.PLAYING]
    );

    await client.query("COMMIT");
    console.log(`List updated successfully.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating list:", error);
  } finally {
    client.release();
  }
}
