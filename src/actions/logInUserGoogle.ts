"use server"
import { pool } from '@/util/postgres';
import { v4 as uuid } from "uuid";

export async function logInUserGoogle(userGoogleId:string, userEmail:string) {
    
    const res = await pool.query(
        `SELECT user_id, user_name, user_password FROM users WHERE user_email = $1`,
        [userEmail]
    )

    if (res.rows.length !== 1) {
        // If the user doesn't exist, we create a new user with the email as the username and a random password
        const userId = uuid();
        const userName:string = 'User'+userGoogleId;
        const userBio:string = "Welcome to my profile!"
        const userLocation:string = "No mans land"

        await pool.query(
        `INSERT INTO users (
            user_id, user_name, user_email, user_bio, user_location, user_google_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, userName, userEmail, userBio, userLocation, userGoogleId]
        );

        return {userId, userName }

    }else {
        // If it already exists, we just return the user data (id and name)
        const userIdLogged = res.rows[0].user_id
        const userNameLogged = res.rows[0].user_name
        return {userId: userIdLogged, userName: userNameLogged}
    }
}

