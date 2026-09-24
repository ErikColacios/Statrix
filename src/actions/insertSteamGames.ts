"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import getGameInfoByNameIGDB from "./getGameInfoByNameIGDB";
import { GameIGDB } from "@/types/GameIGDB";
import { GameStatus } from "@/enums/GameStatus";

export default async function insertSteamGames(steamGames: any[]) {
  const session: any = await getSessionUser();
  const userId: string = session.user.id as string;

  if (!userId) {
    console.warn("No user session found.");
    return { success: false, message: "No user session found." };
  }

  try {
    let notFoundGames: string[] = [];
    let importedGames: number = 0;

    for (const game of steamGames) {

      // For each Steam game, we match the info with the IGDB api to insert it to the database.
      const gameIGDB: GameIGDB = await getGameInfoByNameIGDB(game.name);
      console.log(game.name, gameIGDB?.id);

      if (gameIGDB && gameIGDB.cover && gameIGDB.cover.image_id) {
        const gameBaseImage = `https://images.igdb.com/igdb/image/upload/t_720p/${gameIGDB.cover.image_id}.png`;

        await pool.query(
          `INSERT INTO user_videogame (user_id, game_id, favourite, score, hours_played, year_completed, game_name, game_image_id, game_base_image, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (user_id, game_id) DO NOTHING`,
          [
            userId,
            gameIGDB.id,
            false,
            0,
            0,
            "-",
            gameIGDB.name,
            gameIGDB.cover.image_id,
            gameBaseImage,
            GameStatus.PLAYING,
          ],
        );

        importedGames++;
      } else {
        notFoundGames.push(game.name);
        console.warn(`Game "${game.name}" not found in IGDB or missing cover image.`);
      }
    }

    // In the end we return the games that were not found in IGDB
    if (notFoundGames.length > 0) {
      return {
        success: false,
        message: "There was an error inserting Steam games.",
        notFoundGames: notFoundGames,
        importedGames: importedGames
      };
    }
  } catch (error) {
    console.error("Error inserting Steam games:", error);
    return {
      success: false,
      message: "There was an error inserting Steam games.",
      notFoundGames: [],
      importedGames: 0
    };
  }
}
