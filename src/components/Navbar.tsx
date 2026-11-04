import React from "react";
import Link from "next/link";
import NavbarProfileButton from "./NavbarProfileButton";
import NavbarLinks from "./NavbarLinks";
import NavbarMobileMenu from "./NavbarMobileMenu";
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

    const user = userInfo.length > 0
        ? {
            userId: userInfo[0].user_id as string,
            userName: userInfo[0].user_name as string,
            avatarImage: userInfo[0].user_avatar ? `https://media.statrix.app/avatars/${userInfo[0].user_id}/${userInfo[0].user_avatar}` : "/avatarImages/avatar_default.jpg",
        }
        : null

    return (
        <header className="fixed inset-x-0 top-0 z-99">
            {/* Full width bar attached to the top. It is relative so the dropdowns can be positioned against it */}
            <nav className="relative flex h-16 items-center gap-2 border-b border-white/10 bg-zinc-950/70 pl-4 pr-2 text-sm text-white backdrop-blur-xl md:px-8 lg:px-16">
                <Link href="/" className="shrink-0">
                    <img src="/logos/st2_white.png" className="hidden h-7 w-auto sm:block" alt="Statrix Logo" />
                    <img src="/logos/st1_white.png" className="h-8 w-auto sm:hidden" alt="Statrix Logo small" />
                </Link>

                {/* Desktop links, centered in the bar */}
                <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
                    <NavbarLinks isLogged={!!user} />
                </div>

                <div className="ml-auto flex items-center gap-1">
                    {user &&
                        <>
                            <Notifications userId={user.userId} notificationCount={notificationCount} />
                            <div className="ml-1 hidden md:block">
                                <NavbarProfileButton avatarImage={user.avatarImage} userName={user.userName} />
                            </div>
                        </>}

                    {/* Log in and sign up buttons, on mobile they are inside the menu */}
                    {!user &&
                        <div className="hidden items-center gap-2 md:flex">
                            <Link href="/login" className="flex h-9 items-center rounded-lg px-3 font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white">
                                Log in
                            </Link>
                            <Link href="/signup" className="flex h-9 items-center rounded-lg bg-linear-to-r from-green-500 to-lime-500 px-4 font-semibold transition duration-300 hover:from-green-500 hover:to-lime-600">
                                Sign up
                            </Link>
                        </div>}

                    <div className="md:hidden">
                        <NavbarMobileMenu user={user ? { userName: user.userName, avatarImage: user.avatarImage } : null} />
                    </div>
                </div>
            </nav>
        </header>
    )
}
