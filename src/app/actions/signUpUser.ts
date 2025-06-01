"use server"
import supabase from '@/util/supabase-browser'
import { redirect } from 'next/navigation';
import { v4 as uuid } from "uuid";
import User from '../types/User';
import { pool } from '@/util/postgres'

export async function signUp(formData: FormData) {
    
    // First generates a random uuid for the new user
    const user_id = uuid();

    // Gets the data from the form
    const user_name = formData.get("username") as string;
    const user_email = formData.get("email") as string;
    const user_password = formData.get("password") as string;

    // Get the actual date
    var user_creationdate = new Date().toISOString();
    console.log(user_creationdate)
    const user_bio:string = "Welcome to my profile!"
    const user_lists:number = 0
    const user_location:string = "No mans land"

    let redirectPath: string | null = null

    // Postgresql method
    try {
        await pool.query(
            `INSERT INTO users (user_id, user_name, user_email, user_password, user_lists, user_bio, user_location )
            VALUES ('${user_id}', '${user_name}', '${user_email}', '${user_password}', ${user_lists}, '${user_bio}', '${user_location}' )`);

    redirectPath = "/"
    } catch (error){
        console.log(error)
    }finally{
        if(redirectPath)
            redirect(redirectPath)
    }


    //INSERT INTO public.users(
	//user_id, user_name, user_email, user_password, user_lists, user_bio, user_location, user_webpage, user_avatar, user_banner, user_avatar_id, user_banner_id)
	//VALUES ('8e4bde87-c127-474c-80cc-c0f1f8601db9', 'erik', 'ecolacios@erik.es', '123', 0, 'Welcome', 'Barcelona', 'erikcolacios.com','vault_boy.jpg', 'banner_dummy.jpg', '21', '1');


    // OLD SUPABASE METHOD
    // Inserts the user data to the users table
    //const { error } = await supabase.from('user').insert({user_id, user_name, user_email, user_password, user_creationdate, user_bio});
    // if(error){
    //     console.log(error.message)
    // }else{
    //     console.log("User created!")
    //     redirect("/")
    // }
}