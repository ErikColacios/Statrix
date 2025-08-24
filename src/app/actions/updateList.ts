"use server";
import { pool } from "@/util/postgres";
import { Videogame } from "../types/Videogame";
import { getSession } from "./getSession";
import { Status } from "../enums/GameStatus";

export default async function updateList(
  list_id: number,
  list_name: string,
  oldGamesList: Videogame[],
  newGamesAdded: Videogame[]
) {
  const session = await getSession();
  const user_id = session.user_id;
  const user_name = session.user_name;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete the current list
    await client.query(
      `DELETE FROM list_games lg
        WHERE EXISTS (
            SELECT 1
            FROM list lst
            WHERE lg.list_id = lst.list_id AND lst.user_id = $1 AND lst.list_id = $2
        )`,
      [user_id, list_id]
    );

    // Insert previously existing games (oldGamesList)
    for (const game of oldGamesList) {
      await client.query(
        `INSERT INTO list_games (list_id, game_id, game_name, game_base_image)
         VALUES ($1, $2, $3, $4)`,
        [
          list_id,
          game.game_id,
          game.game_name,
          game.game_base_image,
        ]
      );
    }

    // 3. Insert newly added games (newGamesAdded)
    for (const game of newGamesAdded) {
      const game_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`;

      // Insert into 'list'
      await client.query(
        `INSERT INTO list_games (list_id, game_id, game_name, game_base_image)
         VALUES ($1, $2, $3, $4)`,
        [
          list_id,
          game.id,
          game.name,
          game_base_image,
        ]
      );
      // Insert into 'user_videogame' if not already present
      await client.query(
        `INSERT INTO user_videogame (
                    user_id, game_id, score, hours_played, game_name, game_base_image, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (user_id, game_id) DO NOTHING`,
        [user_id, game.id, 0, 0, game.name, game_base_image, Status.PLAYING]
      );
    }

    await client.query("COMMIT");
    console.log(`List "${list_name}" updated successfully.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating list:", error);
  } finally {
    client.release();
  }
}
