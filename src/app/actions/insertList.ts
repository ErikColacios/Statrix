"use server";
import type { Videogame } from '../types/Videogame';
import { v4 as uuid } from "uuid";
import { getSession } from './getSession';
import { pool } from '@/util/postgres';

export async function insertList(list_name: string, gameList: Videogame[]) {
    const client = await pool.connect();
    try {
        const session = await getSession();
        const list_id = uuid();
        const user_id = session.user_id;
        const user_name = session.user_name;
        const favourite = false;
        const score = 0;
        const hours_played = 0;

        await client.query('BEGIN');

        for (const game of gameList) {
            const videogame_id = game.id;
            const videogame_name = game.name;
            const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`;

            await client.query(
                `INSERT INTO list (list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image]
            );

            await client.query(
                `INSERT INTO user_videogame (user_id, videogame_id, favourite, score, hours_played, videogame_name, videogame_base_image)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (user_id, videogame_id) DO NOTHING`, // evita duplicados si ya existe
                [user_id, videogame_id, favourite, score, hours_played, videogame_name, videogame_base_image]
            );
        }

        await client.query(
            `UPDATE users SET user_lists = user_lists + 1 WHERE user_id = $1`,
            [user_id]
        );

        await client.query('COMMIT');
        console.log(`List "${list_name}" created successfully for user "${user_name}"`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error inserting list:", error);
    } finally {
        client.release();
    }
}
