"use server";
import { pool } from '@/util/postgres';
import { Videogame } from '../types/Videogame';
import { getSession } from './getSession';

export default async function updateList(
    list_id: number,
    list_name: string,
    oldGamesList: Videogame[],
    newGamesAdded: Videogame[]
) {
    const session = await getSession();
    const user_id = session.user_id;
    const user_name = session.user_name;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Delete the current list for the user
        await client.query(
            `DELETE FROM list WHERE list_id = $1 AND user_id = $2`,
            [list_id, user_id]
        );

        // Insert previously existing games (oldGamesList)
        for (const game of oldGamesList) {
            await client.query(
                `INSERT INTO list (
                    list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    list_id,
                    user_id,
                    game.videogame_id,
                    list_name,
                    user_name,
                    game.videogame_name,
                    game.videogame_base_image
                ]
            );
        }

        // 3. Insert newly added games (newGamesAdded)
        for (const game of newGamesAdded) {
            const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`;

            // Insert into 'list'
            await client.query(
                `INSERT INTO list (
                    list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    list_id,
                    user_id,
                    game.id,
                    list_name,
                    user_name,
                    game.name,
                    videogame_base_image
                ]
            );

            // Insert into 'user_videogame' if not already present
            await client.query(
                `INSERT INTO user_videogame (
                    user_id, videogame_id, score, hours_played, videogame_name, videogame_base_image
                ) VALUES ($1, $2, 0, 0, $3, $4)
                ON CONFLICT (user_id, videogame_id) DO NOTHING`,
                [
                    user_id,
                    game.id,
                    game.name,
                    videogame_base_image
                ]
            );
        }

        await client.query('COMMIT');
        console.log(`List "${list_name}" updated successfully.`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating list:", error);
    } finally {
        client.release();
    }
}
