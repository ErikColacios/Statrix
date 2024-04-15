import { SessionData, defaultSession, sessionOptions } from "@/session_lib"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export const getSession = async () => {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if(!session.isLoggedIn){
        session.isLoggedIn = defaultSession.isLoggedIn;
    }
    
    return session;
}