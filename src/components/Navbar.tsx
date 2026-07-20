import React from "react";
import Link from "next/link";
import NavbarProfileButton from "./NavbarProfileButton";
import getUserInfo from "../actions/getUserInfo";
import Notifications from "./Notifications";
import getNotificationCount from "../actions/getNotificationCount";
import getSessionUser from "@/actions/getSessionUser";

export default async function Navbar() {

    let session: any = await getSessionUser()

    let userInfo: any = []
    let notificationCount: number = 0

    if (session) {
        let userName: string = session.user.name as string
        userInfo = await getUserInfo(userName)
        notificationCount = await getNotificationCount() // We fetch the notification count
    }

    return (
        <header className="flex flex-col">
            <div className="flex justify-center items-center w-full bg-black/50 backdrop-blur-xs text-white fixed z-50 top p-4">
                <div className="absolute left-0 pl-4 md:pl-16">
                    <Link href="/"><img src={`/logos/st2_white.png`} className="w-32 hidden sm:flex" alt="Statrix Logo" /></Link>
                    <Link href="/"><img src={`/logos/st1_white.png`} className="w-10 sm:hidden" alt="Statrix Logo" /></Link>
                </div>
                <div className="flex flex-row space-x-4 md:space-x-8 text-xs md:text-base pr-20 md:pr-0 pt-2 pb-2"></div>
                    <div className="flex items-center space-x-3 md:space-x-6 pr-2 absolute right-0">
                        <Link className="p-2 rounded-sm rounded-lg hover:bg-zinc-700 hover:text-green-400" href={"/browseGames"}>Games</Link>
                        {userInfo.length > 0 &&
                            <Link className="p-2 rounded-sm rounded-lg hover:bg-zinc-700 hover:text-green-400" href={"/friends"}>Friends</Link>}

                        {userInfo.length > 0 &&
                            <Notifications userId={userInfo[0].user_id} notificationCount={notificationCount} />}

                        {/* Log In button */}
                        {userInfo.length == 0 &&
                            <Link href="/login" className="relative flex justify-center items-center text-sm bg-zinc-900 border border-green-500 w-32 rounded-sm rounded-lg py-1 text-center mr-2 md:mr-4 transition hover:bg-green-500 hover:text-black">Log in</Link>}

                        {/* Profile button */}
                        {userInfo.length > 0 &&
                            <NavbarProfileButton avatarImage={userInfo[0].avatar_image} />}
                    </div>
            </div>
        </header>
    )
}