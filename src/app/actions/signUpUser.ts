import supabase from '@/utils/supabase-browser'
import { redirect } from 'next/navigation';
import { v4 as uuid } from "uuid";

export async function signUp(formData: FormData) {
    
    // First generates a random uuid for the new user
    const user_id = uuid();

    // Gets the data from the form
    const user_name = formData.get("username") as string;
    const user_email = formData.get("email") as string;
    const user_password = formData.get("password") as string;

    // Get the actual date
    var user_creationdate = new Date()
    user_creationdate.toISOString()

    // Default user bio
    const user_bio:string = "Welcome to my profile!"

    // Inserts the user data to the users table
    const { error } = await supabase.from('user').insert({user_id, user_name, user_email, user_password, user_creationdate, user_bio});

    if(error){
        console.log(error.message)
    }else{
        console.log("User created!")
        redirect("/")
    }
}