"use server"
import supabase from '@/utils/supabase-browser'
import { getSession } from './getSession';
import { redirect } from 'next/navigation';

export async function logInUser(prevState:{ error: undefined | string} , formData: FormData) {

    //First, we get the session 
    const session = await getSession()

    //We get the data from the form
    const user_name = formData.get("usernameLogIn") as string;
    const user_password = formData.get("passwordLogIn") as string;

    // Then we do a SELECT filtering with the username and the password
    const {data} = await supabase.from('user').select().match({user_name: user_name, user_password: user_password})

    if(data != null){
        const count:number = data.length;
        if(count == 1) {
            // Now we create the SESSION
            const userIdLogged = data.map((user) => (user.user_id)).toString()
            const userNameLogged = data.map((user) => (user.user_name)).toString()
            console.log("Bienvenido usuario: " + userNameLogged)
            session.user_id = userIdLogged
            session.user_name = userNameLogged
            session.isLoggedIn = true
            await session.save()
            redirect("/")
            
        }else {
            return {error: "Wrong credentials"}
        }
    }
}