"use server"
import { redirect } from 'next/navigation';
import { v4 as uuid } from "uuid";
import { pool } from '@/util/postgres'
import bcrypt from "bcryptjs";
import { getSession } from './getSession';

export async function signUp(formData: FormData) {
    
    const session = await getSession()
    
    // First generates a random uuid for the new user
    const user_id = uuid();

    // Gets the data from the form
    const user_name = formData.get("username") as string;
    const user_email = formData.get("email") as string;
    const user_password_plain = formData.get("password") as string;

    // Get the actual date
    const user_bio:string = "Welcome to my profile!"
    const user_lists:number = 0
    const user_location:string = "No mans land"

    let redirectPath: string | null = null

    // Postgresql method
    try {
        const hashedPassword = await bcrypt.hash(user_password_plain, 10)

        await pool.query(
            `INSERT INTO users (
                user_id, user_name, user_email, user_password,
                user_lists, user_bio, user_location
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [user_id, user_name, user_email, hashedPassword, user_lists, user_bio, user_location]
        );

        // We destroy the current session just in case, and then we create the new session
        session.destroy()
        session.user_id = user_id
        session.user_name = user_name
        session.isLoggedIn = true
        await session.save()
    redirectPath = "/"
    } catch (error){
        console.log(error)
    }finally{
        if(redirectPath)
            redirect(redirectPath)
    }
}