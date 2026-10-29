"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

const LIMIT = 10;

/**
 * Gets the most popular public lists of the community.
 * Lists have no likes yet, so for now "popular" means the public lists with more games, then the most recent ones.
 * @returns The lists with their author, total games and the first 5 covers
 */
export default async function getPopularLists() {
  const session: any = await getSessionUser();

  if (!session?.user?.id) {
    return { success: false, message: "No user session found.", lists: [] };
  }

  try {
    // 1. JOIN list_games: one row per game of each list (lists without games are left out).
    // 2. GROUP BY: groups those rows back into one row per list, so we can count its games
    //    and collect its covers ordered by rank, keeping only the first 5 ([1:5]).
    // 3. ORDER BY: lists with more games first, then the most recently updated (or created).
    const res = await pool.query(
      `SELECT lst.list_id, lst.list_name, lst.list_creationdate, lst.list_mode, usr.user_name,
              COUNT(lg.game_id)::int AS total_games,
              (ARRAY_AGG(lg.game_base_image ORDER BY lg.rank_order))[1:5] AS covers
       FROM list lst
       INNER JOIN users usr ON lst.user_id = usr.user_id
       INNER JOIN list_games lg ON lg.list_id = lst.list_id
       WHERE lst.list_visibility = 'public'
       GROUP BY lst.list_id, lst.user_id, usr.user_id
       ORDER BY total_games DESC, COALESCE(lst.list_updated_at, lst.list_creationdate) DESC
       LIMIT $1;`,
      [LIMIT]
    );

    const lists: PopularList[] = res.rows;
    return { success: true, message: "Popular lists loaded.", lists };

  } catch (error) {
    console.error("Error fetching popular lists:", error);
    return { success: false, message: "There was an error loading the popular lists.", lists: [] };
  }
}
