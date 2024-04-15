import { SessionOptions } from "iron-session";

export interface SessionData {
    user_id?:string;
    user_name?:string;
    isLoggedIn:boolean;
}

export const defaultSession:SessionData = {
    isLoggedIn:false
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: "user-session",
    cookieOptions:{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
}