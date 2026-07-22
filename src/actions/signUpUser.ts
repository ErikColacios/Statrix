"use server"
import { redirect } from 'next/navigation';
import { v4 as uuid } from "uuid";
import { pool } from '@/util/postgres'
import bcrypt from "bcryptjs";
import { sendEmail } from './sendEmail';

export async function signUp(prevState:{ error: undefined | string} , formData: FormData) {
    
    await sendEmail()

    // First generates a random uuid for the new user
    const user_id = uuid();

    // Gets the data from the form
    const userName = formData.get("userNameSignUp") as string;
    const userEmail = formData.get("emailSignUp") as string;
    const userPasswordPlain = formData.get("passwordSignUp") as string;
    const userBio:string = "Welcome to my profile!"
    const userLists:number = 0
    const userLocation:string = "No mans land"

    let redirectPath: string | null = null
    try {
        if (userName.includes(" ")) {
            return { error: "The user name must not contain whitespaces"};
        }

        // const res = await pool.query(`SELECT user_id, user_name, user_password FROM users WHERE user_name = $1 OR user_email = $2`, 
        //     [userName, userEmail])

        // if (res.rows.length === 0) {
        //     // If the email doesn't exist, we create the new user
        //     const hashedPassword = await bcrypt.hash(userPasswordPlain, 10)

        //     await pool.query(
        //         `INSERT INTO users (
        //             user_id, user_name, user_email, user_password,user_lists, user_bio, user_location)
        //         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        //         [user_id, userName, userEmail, hashedPassword, userLists, userBio, userLocation]
        //     );
        // } else {
        //     return { error: "There is an existing account with this user name or email" };
        // }

    //redirectPath = "/"
    } catch (error){
        return { error };
    } finally{
        if(redirectPath)
            redirect(redirectPath)
    }
}