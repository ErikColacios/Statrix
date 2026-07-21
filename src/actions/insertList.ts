"use server";
import type { Game } from "../types/Game";
import { v4 as uuid } from "uuid";
import getSessionUser from "./getSessionUser";
import { pool } from "@/util/postgres";
import { GameStatus } from "../enums/GameStatus";

export async function insertList(listName: string, listDescription:string, listVisibility:string | undefined, isFeatured:boolean, gameList: Game[]) {
  const client = await pool.connect();
  try {
    const session:any = await getSessionUser();
    const listId = uuid();
    const userId:string = session.user.id as string;
    const userName:string = session.user.name as string;
    const favourite:boolean = false;
    const score:number = 0;
    const hours_played:number = 0;

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO list (list_id, user_id, list_name, list_description, user_name, list_visibility, list_featured)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [listId, userId, listName, listDescription, userName, listVisibility, isFeatured]
    );

    for (const game of gameList) {
      const gameId = game.id;
      const gameName = game.name;
      const gameImageId = game.cover.image_id;
      const gameBaseImage = `https://images.igdb.com/igdb/image/upload/t_720p/${gameImageId}.png`;

      await client.query(
        `INSERT INTO list_games (list_id, game_id, game_name, game_image_id, game_base_image, user_id)
                VALUES ($1, $2, $3, $4, $5, $6)`,
        [listId, gameId, gameName, gameImageId, gameBaseImage, userId]
      );
      await client.query(
        `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, game_name, game_image_id, game_base_image, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (user_id, game_id) DO NOTHING`,
        [
          userId,
          gameId,
          favourite,
          score,
          hours_played,
          gameName,
          gameImageId,
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
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting list:", error);
  } finally {
    client.release();
  }
}