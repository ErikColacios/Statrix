"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SessionData, defaultSession, sessionOptions } from "@/session_lib"
import { getIronSession } from "iron-session"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers"

export default async function getSessionUser() {
    const session: any = await getServerSession(authOptions)
    if (session) {
        return session;
    }
}


// "use server"
// import { SessionData, defaultSession, sessionOptions } from "@/session_lib"
// import { getIronSession } from "iron-session"
// import { cookies } from "next/headers"

// export const getSession = async () => {
//     const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    
//     if(!session.isLoggedIn){
//         session.isLoggedIn = defaultSession.isLoggedIn;
//     }
    
//     return session;
// }