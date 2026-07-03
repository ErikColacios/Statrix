"use server"
import { pool } from '@/util/postgres';
import bcrypt from 'bcryptjs';

export async function logInUser(userName:string, password:string) {

    console.log("Logging in with: ", userName)
    
    const res = await pool.query(
        `SELECT user_id, user_name, user_password FROM users WHERE user_name = $1`,
        [userName]
    )

    if (res.rows.length === 0) {
        return { error: "No user found with that user name" };
    }
    else if (res.rows.length !== 1) {
        return { error: "Wrong credentials" };
    }

    console.log(res.rows[0].user_password)

    if (res.rows[0].user_password === null) {
        return { error: "Something went wrong" };
    }
    
    const userIdLogged = res.rows[0].user_id
    const userNameLogged = res.rows[0].user_name
    const passwordMatch = await bcrypt.compare(password, res.rows[0].user_password);

    if (!passwordMatch) {
        return { error: "Wrong credentials" };
    } else {
        return {userIdLogged, userNameLogged, passwordMatch}
    }
}