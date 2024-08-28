"use server"
import { supabase } from "@/utils/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "./getSession"

export default async function updateUser(prevState:any , formData: FormData){
    
    const session = await getSession()
    var user_id = session.user_id
    var user_name = formData.get("user_name")
    var user_bio = formData.get("user_bio")
    var user_email = formData.get("user_email")
    var user_location = formData.get("user_location")
    var user_webpage = formData.get("user_webpage")


    const { error } = await supabase.from('user')
        .update({'user_name': user_name, "user_bio": user_bio, "user_email": user_email, "user_location": user_location, "user_webpage": user_webpage})
        .match({user_id:user_id})
        
    if(error){
        console.log(error)
        return;
    }else {
        return "User updated successfully!"
    }
}