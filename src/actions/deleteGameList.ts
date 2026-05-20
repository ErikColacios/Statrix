"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";
import { useRouter } from "next/navigation";

export async function deleteGameList(listId: string, gameId: number | undefined) {
  try {
    const session:any = await getSessionUser();
    const userId:string = session.user.id as string;

    await pool.query(
      `DELETE FROM list_games
       WHERE list_id = $1 AND game_id = $2 AND user_id = $3;`,
      [listId, gameId, userId]
    );

  } catch (error) {
    console.error("Error deleting game from list: ", error);
  }
}