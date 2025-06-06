"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { error } from 'console';

export async function logInUser(prevState:{ error: undefined | string} , formData: FormData) {

    //First, we get the session 
    const session = await getSession()

    //We get the data from the form
    const user_name = formData.get("usernameLogIn") as string;
    const user_password = formData.get("passwordLogIn") as string;

    let redirectPath: string | null = null
    
    // Postgres method
    try {
        const res = await pool.query(
            `SELECT user_id, user_name, user_password FROM users WHERE user_name = $1`,
            [user_name]
        );

        if (res.rows.length !== 1) {
            return { error: "Wrong credentials" };
        }

        // Now we create the SESSION
        const userIdLogged = res.rows[0].user_id
        const userNameLogged = res.rows[0].user_name
        const passwordMatch = await bcrypt.compare(user_password, res.rows[0].user_password);

        if (!passwordMatch) {
            return { error: "Wrong credentials" };
        }

        session.user_id = userIdLogged
        session.user_name = userNameLogged
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