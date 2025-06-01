"use server"
import { pool } from "@/util/postgres";

export default async function getBannerImages (){

    try{
        const res = await pool.query(`SELECT * FROM banner_images`)
        return res.rows
    }catch(error){
        console.log(error)
        return;
    }

}