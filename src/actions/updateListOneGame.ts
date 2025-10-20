"use server";
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";
import { GameStatus } from "@/enums/GameStatus";

export default async function updateListOneGame(
  list_id: string,
  game_id: string,
  game_name: string,
  image_id: string
) {
  const session = await getSession();
  const user_id = session.user_id;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert the new game in 'list_games'
    const game_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${image_id}.png`;

    await client.query(
      `INSERT INTO list_games (
                    list_id, game_id, game_name, game_base_image
                ) VALUES ($1, $2, $3, $4)`,
      [list_id, game_id, game_name, game_base_image]
    );
    // Insert into 'user_videogame' if not already present
    await client.query(
      `INSERT INTO user_videogame (
                    user_id, game_id, score, hours_played, game_name, game_base_image, status
                ) VALUES ($1, $2, 0, 0, $3, $4, $5)
                ON CONFLICT (user_id, game_id) DO NOTHING`,
      [user_id, game_id, game_name, game_base_image, GameStatus.PLAYING]
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
