import React from "react";
import Link from "next/link";
import localFont from 'next/font/local'
import NavbarProfileButton from "./NavbarProfileButton";
import getUserInfo from "../actions/getUserInfo";
import Notifications from "./Notifications";
import getNotificationCount from "../actions/getNotificationCount";
import getSessionUser from "@/actions/getSessionUser";

const infiniteBeyondFont = localFont({ src: '../fonts/InfiniteBeyondItalic-rgPlO.ttf' })

export default async function Navbar() {

    const session: any = await getSessionUser()
    console.log(session)

    let userInfo: any = []
    let notificationCount: number = 0

    if (session) {
        const userName: string = session.user.name as string
        userInfo = await getUserInfo(userName)
        notificationCount = await getNotificationCount() // We fetch the notification count
    }

    return (
        <header className="flex flex-col">
            <div className="flex justify-center items-center w-full bg-black/50 backdrop-blur-sm text-white fixed z-50 top p-4">
                <div className="absolute left-0 pl-4 md:pl-16">
                    <Link href="/"><p className={`text-sm md:text-xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</p></Link>
                </div>
                <div className="flex flex-row space-x-4 md:space-x-8 text-xs md:text-base pr-20 md:pr-0 pt-2 pb-2"></div>
                <div className="flex items-center space-x-6 absolute right-0">
                    {userInfo.length > 0 &&
                        <p className="hidden text-sm sm:flex text-gray-500 mr-14">{userInfo[0].user_id}</p>}

                    {userInfo.length > 0 &&
                        <Notifications userId={userInfo[0].user_id} notificationCount={notificationCount} />}

                    {userInfo.length > 0 &&
                        <Link className="p-2 rounded rounded-lg hover:bg-zinc-700 hover:text-green-400" href={"/friends"}>Friends</Link>}

                    {/* Log In button */}
                    {userInfo.length == 0 &&
                        <Link href="/login" className="relative flex justify-center items-center text-sm bg-zinc-900 border border-green-500 w-32 rounded rounded-lg pt-1 pb-1 text-center mr-2 md:mr-4 transition hover:bg-green-500 hover:text-black">Log in</Link>}

                    {/* Profile button */}
                    {userInfo.length > 0 &&
                        <NavbarProfileButton userName={userInfo[0].user_name} avatarImage={userInfo[0].avatar_image}  />}
                </div>
            </div>
        </header>
    )
}