"use server";
import { pool } from "@/util/postgres";
import getSessionUser from "./getSessionUser";

const PAGE_SIZE = 20;

/**
 * Gets the community activity feed (the latest activity of each user), paginated with a cursor.
 * @param cursor The last item of the previous page, undefined for the first page
 * @returns The activity and the cursor of the next page (null if there are no more pages)
 */
export default async function getFeedActivity(cursor?: FeedCursor) {
  const session: any = await getSessionUser();

  if (!session?.user?.id) {
    return { success: false, message: "No user session found.", activity: [], nextCursor: null };
  }

  try {
    // The subquery keeps only the latest activity of each user (DISTINCT ON).
    // $1 = null skips the cursor filter
    const res = await pool.query(
      `SELECT * FROM (
          SELECT DISTINCT ON (uga.user_id) uga.activity_id, uga.user_id, usr.user_name, usr.user_avatar, uga.game_id, uga.game_name, uga.game_base_image, uga.action, uga.action_date
          FROM user_game_activity uga
          INNER JOIN users usr ON uga.user_id = usr.user_id
          ORDER BY uga.user_id, uga.action_date DESC, uga.activity_id DESC
       ) latest
       WHERE ($1::date IS NULL OR (latest.action_date, latest.activity_id) < ($1::date, $2::bigint))
       ORDER BY latest.action_date DESC, latest.activity_id DESC
       LIMIT $3;`,
      [cursor?.action_date ?? null, cursor?.activity_id ?? null, PAGE_SIZE + 1]
    );

    // We ask for one extra row only to know if there is a next page
    const hasMore = res.rows.length > PAGE_SIZE;
    const activity: FeedActivity[] = res.rows.slice(0, PAGE_SIZE);
    const last = activity[activity.length - 1];
    const nextCursor: FeedCursor | null = hasMore ? { action_date: last.action_date, activity_id: last.activity_id } : null;

    return { success: true, message: "Feed loaded.", activity, nextCursor };

  } catch (error) {
    console.error("Error fetching feed activity:", error);
    return { success: false, message: "There was an error loading the feed.", activity: [], nextCursor: null };
  }
}
