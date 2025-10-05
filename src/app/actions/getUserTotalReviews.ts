import { pool } from "@/util/postgres";

/**
 * Gets the count of reviews from the user.
 * @param user_name User name
 * @returns Total reviews as number
 */
export async function getUserTotalReviews(user_name: string | undefined) {
  if (!user_name) {
    console.warn("Parameter user_name not found.");
    return 0;
  }

  try {
    const res = await pool.query(
      `SELECT COUNT(1)::int
             FROM reviews rev
             INNER JOIN users usr ON usr.user_id = rev.user_id
             WHERE usr.user_name = $1`,
      [user_name]
    );

    const totalReviews: number = res.rows[0].count;
    return totalReviews;
  } catch (error) {
    console.error("Error fetching total usser reviews:", error);
    return 0;
  }
}
