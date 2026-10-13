"use server"
import { pool } from '@/util/postgres';
import getSessionUser from './getSessionUser';
import { ListMode } from '@/enums/ListMode';
import { Game } from '@/types/Game';

export default async function updateListInfo(listId:string, listName:string, listDescription:string, listVisibility:string, listFeatured:boolean, listMode: string, listContent:Game[]){
    const session = await getSessionUser()
    const userId = session.user.id

    if (!userId) {
        return { success: false, message: "No user session found." };
    }

    try {
        await pool.query(`UPDATE list SET list_name = $1, list_description = $2, list_visibility = $3, list_featured = $4, list_mode = $5 WHERE list_id = $6 AND user_id = $7`,
        [listName, listDescription, listVisibility, listFeatured, listMode, listId, userId ])


        // If the list mode is ranked, we set the order rank of each game. If its unranked, we set every rank_order to null
        if (listMode === ListMode.RANKED) {
            listContent.map((game:Game, index:number) => {
                pool.query(`UPDATE list_games SET rank_order = $1 WHERE list_id = $2 AND user_id = $3 AND game_id = $4`,
                [index, listId, userId, game.game_id ])
            })
        } else {
            await pool.query(`UPDATE list_games SET rank_order = $1 WHERE list_id = $2 AND user_id = $3`,
            [null, listId, userId ])
        }

        return { success: true, message: "List information updated." };
    } catch(error){
        console.error("Error updating list information:", error);
        return { success: false, message: "Database error." };
    }
}