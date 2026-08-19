"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { GameStatus } from "@/enums/GameStatus";
import { List } from "@/types/List";

export default async function updateListOneGame(
  list: List,
  gameId: string,
  gameName: string,
  gameBaseImage: string
) {
  const session:any = await getSessionUser();
  const userId:string = session.user.id as string;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // We add the game to the selected list
    await client.query(
      `INSERT INTO list_games (
                    list_id, game_id, user_id, game_name, game_base_image
                ) VALUES ($1, $2, $3, $4, $5)`,
      [list.list_id, gameId, userId, gameName, gameBaseImage]
    );

    // Insert into 'user_videogame' if not already present
    await client.query(
      `INSERT INTO user_videogame (
                    user_id, game_id, game_name, game_base_image, score, hours_played, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (user_id, game_id) DO NOTHING`,
      [userId, gameId, gameName, gameBaseImage, null, null, GameStatus.PLAYING]
    );

    await client.query("COMMIT");
    console.log(`Game added successfully!`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating list:", error);
  } finally {
    client.release();
  }
}