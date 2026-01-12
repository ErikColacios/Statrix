"use server"
import { pool } from "@/util/postgres";
import { getSession } from "./getSession";
import { List } from "@/types/List";


/**
 * Retrieves all lists created by the user associated with the session.
 * @returns List of user-created lists, ordered by creation date
 */
export async function getListsUser(): Promise<List[]> {
    const session = await getSession();
    const user_id = session.user_id;
    
    if (!user_id) {
        console.warn("No user session found.");
    }

    let lists:List[] = []

    try {
        const { rows } = await pool.query(
            `SELECT list_id, list_name, list_creationdate
             FROM list
             WHERE user_id = $1
             ORDER BY list_creationdate DESC`,
            [user_id]
        );


        for(let i = 0; i< rows.length; i++) {
            const list_id:string = rows[i].list_id;
            const list_name:string = rows[i].list_name;
            const list_creationdate:string = rows[i].list_creationdate;
            let covers:string[] = []
            
            const coversRes = await pool.query(
                `SELECT game_base_image,
                    (SELECT COUNT(*) FROM list_games WHERE list_id = $1) as totalGames
                FROM list_games
                WHERE list_id= $1
                LIMIT 5`,
                [list_id]
            );
            covers = coversRes.rows
            const list:List = {list_id, list_name, list_creationdate, covers}
            lists.push(list)

        }
        //console.log(lists[0].covers[0])
        return lists;
    } catch (error) {
        console.error("Error fetching user lists:", error);
        return lists;
    }
}
