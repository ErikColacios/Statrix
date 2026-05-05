"use server";
import type { Game } from "../types/Game";
import { v4 as uuid } from "uuid";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";
import { GameStatus } from "../enums/GameStatus";

export async function insertList(list_name: string, gameList: Game[]) {
  const client = await pool.connect();
  try {
    const session:any = await getSessionUser();
    const listId = uuid();
    const userId:string = session.user.id as string;
    const userName:string = session.user.name as string;
    const favourite = false;
    const score = 0;
    const hours_played = 0;

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO list (list_id, user_id, list_name, user_name)
                VALUES ($1, $2, $3, $4)`,
      [listId, userId, list_name, userName]
    );

    for (const game of gameList) {
      const gameId = game.id;
      const gameName = game.name;
      const gameBaseImage = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`;

      await client.query(
        `INSERT INTO list_games (list_id, game_id, game_name, game_base_image, user_id)
                VALUES ($1, $2, $3, $4, $5)`,
        [listId, gameId, gameName, gameBaseImage, userId]
      );
      await client.query(
        `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, game_name, game_base_image, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (user_id, game_id) DO NOTHING`, // evita duplicados si ya existe
        [
          userId,
          gameId,
          favourite,
          score,
          hours_played,
          gameName,
          gameBaseImage,
          GameStatus.PLAYING,
        ]
      );
    }

    await client.query(
      `UPDATE users SET user_lists = user_lists + 1 WHERE user_id = $1`,
      [userId]
    );

    await client.query("COMMIT");
    console.log(`List "${list_name}" created successfully for user "${userName}"`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting list:", error);
  } finally {
    client.release();
  }
}