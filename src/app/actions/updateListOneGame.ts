"use server";
import { pool } from '@/util/postgres';
import { getSession } from './getSession';
import { Status } from '../enums/Status';

export default async function updateListOneGame(
    list_id: string,
    list_name: string,
    game_id: string,
    game_name: string,
    image_id:string
) {
    const session = await getSession();
    const user_id = session.user_id;
    const user_name = session.user_name;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Insert new game
            const videogame_base_image = `https://images.igdb.com/igdb/image/upload/t_720p/${image_id}.png`;

            // Insert into 'list'
            await client.query(
                `INSERT INTO list (
                    list_id, user_id, videogame_id, list_name, user_name, videogame_name, videogame_base_image
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    list_id,
                    user_id,
                    game_id,
                    list_name,
                    user_name,
                    game_name,
                    videogame_base_image
                ]
            );
            // Insert into 'user_videogame' if not already present
            await client.query(
                `INSERT INTO user_videogame (
                    user_id, videogame_id, score, hours_played, videogame_name, videogame_base_image, status
                ) VALUES ($1, $2, 0, 0, $3, $4, $5)
                ON CONFLICT (user_id, videogame_id) DO NOTHING`,
                [
                    user_id,
                    game_id,
                    game_name,
                    videogame_base_image,
                    Status.PLAYING
                ]
            );

        await client.query('COMMIT');
        console.log(`List "${list_name}" updated successfully.`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating list:", error);
    } finally {
        client.release();
    }
}
