"use server"
import { pool } from '@/util/postgres'
import { redirect } from 'next/navigation'

export async function deleteList(list_id:string, user_id:string | undefined){
    let redirectPath: string | null = null

    try {
        // First we delete the List
        await pool.query(`DELETE FROM list WHERE list_id = '${list_id}' AND user_id = '${user_id}'`)
        console.log("List: " + list_id + " deleted successfuly.")

        // Then, we get the number of Lists of this user
        const res = await pool.query(`SELECT user_id, user_name, user_lists FROM users WHERE user_id='${user_id}'`);
        let newNumberOfLists = res.rows[0].user_lists
        newNumberOfLists = newNumberOfLists -1;

        // Finally, we update the new quantity of Lists of this User and we SUBSTRACT 1 to the user_lists field
        await pool.query(`UPDATE users SET user_lists = ${newNumberOfLists} WHERE user_id = '${user_id}'`)
        redirectPath = "/mylists";
        
    } catch (error){
        console.log(error)
        return;
    } finally {
        if(redirectPath)
            redirect(redirectPath)
    }
}
