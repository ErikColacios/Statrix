"use server"
import { pool } from "@/util/postgres";

export default async function getUserInfo(userName: string | undefined) {
    if (!userName) {
        throw new Error("The parameter userName is mandatory");
    }

    try {
        const query = `SELECT *, 
                (SELECT COUNT(1) FROM user_friendships WHERE (requester_name = $1 OR addressee_name = $1) AND status = 'Accepted') as friends
            FROM users
            WHERE user_name = $1`;

        const { rows } = await pool.query(query, [userName]);
        return rows;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}