import React from "react";
import Link from "next/link";
import { getSession } from "../actions/getSession";
import LogOutButton from "./LogOutButton";
import localFont from 'next/font/local'
import Image from "next/image";
import getUserInfo from "../actions/getUserInfo";

const infiniteBeyondFont = localFont({src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf'})

export default async function Navbar() {

    const session = await getSession()
    const user_id:string | undefined = session.user_id;
    let user_info:any | undefined = []

    if(user_id !== undefined){
        user_info = await getUserInfo(user_id)
    }
    
    return(
        <nav className="flex justify-center items-center w-full bg-black/50 backdrop-blur-sm text-white fixed z-50 top p-4">
            <div className="absolute left-0 pl-4 md:pl-16">
                <Link href="/"><p className={`text-sm md:text-xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</p></Link>
            </div>
            <div className="flex flex-row space-x-4 md:space-x-8 text-xs md:text-base  pr-20 md:pr-0">
                <Link href="/mylists" className="hover:text-green-400">My lists</Link>
                {!session.isLoggedIn && <Link href="/login" className="hover:text-green-400">Log in</Link>}
            </div>
            <div className="flex items-center absolute right-0 mr-8">
                {session.isLoggedIn && 
                <Link href="/profile" className="relative flex justify-center items-center bg-black border border-green-500 w-32 rounded rounded-2xl pt-1 pb-1 text-center mr-2 md:mr-6 transition hover:bg-green-500 hover:text-black">
                {user_info.map((item:any)=> (
                <div className="absolute left-0 w-8 rounded rounded-full overflow-hidden mr-2">
                    <img src={"/avatarImages/"+item.avatar_image} className="h-full w-full object-cover"/>
                </div>
                ))}
                <p>{session.user_name}</p></Link>}

                {session.isLoggedIn && <LogOutButton/>}
            </div>
        </nav>
    )
}