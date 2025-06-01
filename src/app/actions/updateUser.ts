"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "./getSession"
import { pool } from "@/util/postgres"

export default async function updateUser(prevState:any , formData: FormData){
    
    const session = await getSession()
    var user_id = session.user_id
    var user_name = formData.get("user_name")
    var user_bio = formData.get("user_bio")
    var user_email = formData.get("user_email")
    var user_location = formData.get("user_location")
    var user_webpage = formData.get("user_webpage")

    try{
        await pool.query(`UPDATE users
            SET user_name= '${user_name}' , user_bio ='${user_bio}' , user_email = '${user_email}' , user_location = '${user_location}', user_webpage = '${user_webpage}'
            WHERE user_id = '${user_id}'`);
        return "User updated successfully!"
    }catch(error){
        console.log(error)
    }
}