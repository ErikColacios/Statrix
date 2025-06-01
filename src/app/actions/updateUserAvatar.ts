"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateUserAvatar(avatar_id:number, avatar_name:string){
    const session = await getSession()
    const user_id = session.user_id

    try{
        await pool.query(`UPDATE users
            SET user_avatar_id= '${avatar_id}' , user_avatar ='${avatar_name}'
            WHERE user_id = '${user_id}'`);

        var res = "User avatar updated successfully!"
        return res
    }catch(error){
        console.log(error)
        return;
    }
}