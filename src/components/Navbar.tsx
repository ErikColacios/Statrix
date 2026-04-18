import React from "react";
import Link from "next/link";
import localFont from 'next/font/local'
import NavbarProfileButton from "./NavbarProfileButton";
import { getSession } from "../actions/getSession";
import getUserInfo from "../actions/getUserInfo";
import { logOut } from "../actions/logOutUser";
import Notifications from "./Notifications";
import getNotificationCount from "../actions/getNotificationCount";
import { useSession } from "next-auth/react";
import { Session, User, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const infiniteBeyondFont = localFont({ src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf' })

export default async function Navbar() {

    const session: any = await getServerSession(authOptions)
    let user_info: any = []
    let notificationCount: number = 0

    if (session) {
        const user: User = session.user
        const userId: string = user.id as string
        const userName: string = user.name as string

        if (userId !== undefined) {
            user_info = await getUserInfo(userName)
            notificationCount = await getNotificationCount() // We fetch the notification count
        }
    }

    return (
        <header className="flex flex-col">
            <div className="flex justify-center items-center w-full bg-black/50 backdrop-blur-sm text-white fixed z-50 top p-4">
                <div className="absolute left-0 pl-4 md:pl-16">
                    <Link href="/"><p className={`text-sm md:text-xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</p></Link>
                </div>
                <div className="flex flex-row space-x-4 md:space-x-8 text-xs md:text-base pr-20 md:pr-0 pt-2 pb-2"></div>
                <div className="flex items-center space-x-6 absolute right-0">
                    {session &&
                        <p className="hidden text-sm sm:flex text-gray-500 mr-14">{session.user_id}</p>}

                    {session &&
                        <Notifications userId={user_info[0].user_id} notificationCount={notificationCount} />}

                    {session &&
                        <Link className="p-2 rounded rounded-lg hover:bg-zinc-700 hover:text-green-400" href={"/friends"}>Friends</Link>}

                    {/* Log In button */}
                    {!session &&
                        <Link href="/login" className="relative flex justify-center items-center text-sm bg-zinc-900 border border-green-500 w-32 rounded rounded-2xl pt-1 pb-1 text-center mr-2 md:mr-4 transition hover:bg-green-500 hover:text-black">Log in</Link>}

                    {/* Profile button */}
                    {session &&
                        <NavbarProfileButton userName={user_info[0].user_name} avatarImage={user_info[0].avatar_image}  />}
                </div>
            </div>
        </header>
    )
}