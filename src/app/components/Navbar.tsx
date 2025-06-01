import React from "react";
import Link from "next/link";
import { getSession } from "../actions/getSession";
import LogOutButton from "./LogOutButton";
import localFont from 'next/font/local'
import Image from "next/image";

const infiniteBeyondFont = localFont({src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf'})

export default async function Navbar() {

    const session = await getSession()
    
    return(
        <nav className="flex justify-center items-center w-full bg-black/50 backdrop-blur-sm text-white fixed z-50 top p-4">
            <div className="absolute left-0 pl-4 md:pl-16">
                <Link href="/"><p className={`text-sm md:text-xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</p></Link>
            </div>
            <div className="flex flex-row space-x-4 md:space-x-8 text-xs md:text-base  pr-20 md:pr-0">
                <Link href="/mylists" className="hover:text-green-400">My lists</Link>
                {!session.isLoggedIn && <Link href="/login" className="hover:text-green-400">Log in</Link>}
            </div>
            <div className="flex absolute right-0 mr-8">
                {session.isLoggedIn && <Link href="/profile" className="flex text-xs md:text-base justify-center items-center bg-green-500 rounded pl-3 pr-4 text-center mr-2 md:mr-6 hover:bg-green-600"><Image src="/staticImages/icon_user.png" className="w-5" alt="User icon" width={20} height={20}/><p>{session.user_name}</p></Link>}
                {session.isLoggedIn && <LogOutButton/>}
            </div>
        </nav>
    )
}