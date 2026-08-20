"use server";
import { pool } from "@/util/postgres";
import { Game } from "../types/Game";
import getSessionUser from "./getSessionUser";
import { GameStatus } from "../enums/GameStatus";

export default async function updateList(listId: string, newGamesAdded: Game[]) {
  const session:any = await getSessionUser();
  const userId:string = session.user.id as string;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert newly added games (newGamesAdded)
    for (const game of newGamesAdded) {
      const game_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`;

      // Insert into 'list'
      await client.query(
        `INSERT INTO list_games (list_id, game_id, game_name, game_image_id, game_base_image, user_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (list_id, game_id, user_id) DO NOTHING`,
        [
          listId,
          game.game_id,
          game.game_name,
          game.cover.image_id,
          game_base_image,
          userId
        ]
      );
      // Insert into 'user_videogame' if not already present
      await client.query(
        `INSERT INTO user_videogame (
                    user_id, game_id, score, hours_played, game_name, game_image_id, game_base_image, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (user_id, game_id) DO NOTHING`,
        [userId, game.game_id, 0, 0, game.game_name, game.cover.image_id, game_base_image, GameStatus.PLAYING]
      );
    }

    await client.query("COMMIT");
    console.log(`List updated successfully.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating list:", error);
  } finally {
    client.release();
  }
}