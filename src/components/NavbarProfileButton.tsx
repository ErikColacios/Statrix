"use client"
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOutUser } from "@/actions/logOutUser";
import { icons, isActiveLink, userLinks } from "./navbarItems";

type Props = {
    avatarImage: string,
    userName: string
}

// Avatar with the user menu, only on desktop. On mobile these links are in NavbarMobileMenu
export default function NavbarProfileButton({ avatarImage, userName }: Props) {
    const [dropdown, setDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
            setDropdown(false)
        }
    };

    useEffect(() => {
        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [dropdown])

    // Close the menu after navigating
    useEffect(() => {
        setDropdown(false)
    }, [pathname])

    return (
        <div ref={dropdownRef} className="relative">
            <button onClick={() => setDropdown(!dropdown)} aria-label="Open user menu" aria-expanded={dropdown}
                className="flex items-center rounded-full p-0.5 transition hover:bg-white/10">
                <img src={avatarImage} className={`h-8 w-8 rounded-full object-cover ring-2 transition ${dropdown ? "ring-green-500" : "ring-white/10"}`} alt="Avatar image" />
            </button>

            {dropdown &&
                <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 text-sm text-zinc-200 shadow-2xl animate-element-appear">
                    <Link href={`/profile/${userName}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5">
                        <img src={avatarImage} className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" alt="Avatar image" />
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{userName}</p>
                            <p className="text-xs text-zinc-400">View profile</p>
                        </div>
                    </Link>

                    <div className="my-2 h-px bg-white/10" />

                    {userLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/5 hover:text-white ${isActiveLink(pathname, link.href) ? "text-green-400" : ""}`}>
                            <span className="text-zinc-400">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}

                    <div className="my-2 h-px bg-white/10" />

                    <button onClick={() => logOutUser()} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-rose-400 transition hover:bg-rose-500/10">
                        {icons.logOut}
                        Log out
                    </button>
                </div>
            }
        </div>
    )
}
