import React from "react";
import Link from "next/link";
import localFont from 'next/font/local'
import NavbarProfileButton from "./NavbarProfileButton";
import { getSession } from "../actions/getSession";
import getUserInfo from "../actions/getUserInfo";
import { logOut } from "../actions/logOutUser";
import Notifications from "./Notifications";
import getNotificationCount from "../actions/getNotificationCount";

const infiniteBeyondFont = localFont({src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf'})

export default async function Navbar() {

    //const session = await getSession()
    let user_info:any = []
    let notificationCount:number = 0
    //const user_name:string | undefined = session.user_name

    // if(session.user_id !== undefined) {
    //     user_info = await getUserInfo(user_name)
    //     notificationCount = await getNotificationCount() // We fetch the notification count
    // }

    async function handleLogOut(){
        "use server"
        await logOut()
    }
    
    return(
        <header className="flex flex-col">
            <div className="flex justify-center items-center w-full bg-black/50 backdrop-blur-sm text-white fixed z-50 top p-4">
                <div className="absolute left-0 pl-4 md:pl-16">
                    <Link href="/"><p className={`text-sm md:text-xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</p></Link>
                </div>
                <div className="flex flex-row space-x-4 md:space-x-8 text-xs md:text-base pr-20 md:pr-0 pt-2 pb-2"></div>
            </div>
        </header>
    )
}