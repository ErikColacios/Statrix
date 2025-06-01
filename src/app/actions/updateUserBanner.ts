"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';

export default async function updateUserBanner(banner_id:number, banner_name:string){
    const session = await getSession()
    const user_id = session.user_id

    try{
        await pool.query(`UPDATE users
            SET user_banner_id= '${banner_id}' , user_banner ='${banner_name}'
            WHERE user_id = '${user_id}'`);

        var res = "User banner updated successfully!"
        return res
    }catch(error){
        console.log(error)
        return;
    }
}