"use server"
import { pool } from "@/util/postgres";

export default async function getAvatarImages (){

    try{
        const res = await pool.query(`SELECT * FROM avatar_images`)
        return res.rows
    }catch(error){
        console.log(error)
        return;
    }

}