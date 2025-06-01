"use server"
import { pool } from '@/util/postgres';
import { getSession } from './getSession';
import { redirect } from 'next/navigation';

export async function logInUser(prevState:{ error: undefined | string} , formData: FormData) {

    //First, we get the session 
    const session = await getSession()

    //We get the data from the form
    const user_name = formData.get("usernameLogIn") as string;
    const user_password = formData.get("passwordLogIn") as string;

    let redirectPath: string | null = null
    
    // Postgres method
    try {
        const res = await pool.query(`SELECT * FROM users WHERE user_name='${user_name}' AND user_password= '${user_password}' `);
        if(res.rows.length == 1){
            // Now we create the SESSION
            const userIdLogged = res.rows[0].user_id
            const userNameLogged = res.rows[0].user_name
            console.log(userIdLogged + ' ' + userNameLogged)

            session.user_id = userIdLogged
            session.user_name = userNameLogged
            session.isLoggedIn = true
            await session.save()

            redirectPath = "/"
            
        }else{
            return {error: "Wrong credentials"}
        }
    } catch (error){
        console.log(error)
    }finally{
        if(redirectPath)
            redirect(redirectPath)
    }
    
    //Supabase method
    // Then we do a SELECT filtering with the username and the password
    //const {data} = await supabase.from('user').select().match({user_name: user_name, user_password: user_password})

    // if(data != null){
    //     const count:number = data.length;
    //     console.log("Count: " + count)
    //     if(count == 1) {
    //         // Now we create the SESSION
    //         const userIdLogged = data.map((user:any) => user._id.toString())
    //         const userNameLogged = data.map((user:any) => user.user_name)
    //         console.log(userIdLogged)
    //         console.log("Welcome " + userNameLogged)
    //         session.user_id = userIdLogged[0]
    //         session.user_name = userNameLogged
    //         session.isLoggedIn = true
    //         await session.save()
    //         redirect("/")
            
    //     }else {
    //         return {error: "Wrong credentials"}
    //     }
    //}
}