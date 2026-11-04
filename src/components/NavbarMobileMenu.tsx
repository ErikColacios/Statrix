"use client"
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOutUser } from "@/actions/logOutUser";
import { icons, isActiveLink, mainLinks, userLinks } from "./navbarItems";

type Props = {
    // Without user the menu only shows the public links and the log in / sign up buttons
    user: { userName: string, avatarImage: string } | null
}

// Menu button and panel, only on mobile. The panel opens below the navbar
export default function NavbarMobileMenu({ user }: Props) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    // Close the menu after navigating
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!open) return

        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [open])

    const linkClass = (href: string) => `flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition
        ${isActiveLink(pathname, href) ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`

    return (
        <div ref={menuRef}>
            <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/5 hover:text-white">
                {open
                    ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}
            </button>

            {/* Positioned against the navbar (nav is relative), so it takes its whole width minus a small margin */}
            {open &&
                <div className="absolute inset-x-3 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto no-scrollbar rounded-2xl border border-white/10 bg-zinc-950/95 p-2 text-sm shadow-2xl animate-element-appear">
                    {user &&
                        <>
                            <Link href={`/profile/${user.userName}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5">
                                <img src={user.avatarImage} className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" alt="Avatar image" />
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-white">{user.userName}</p>
                                    <p className="text-xs text-zinc-400">View profile</p>
                                </div>
                            </Link>
                            <div className="my-2 h-px bg-white/10" />
                        </>
                    }

                    {mainLinks.filter(link => user || !link.requiresSession).map(link => (
                        <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                            <span className="text-zinc-400">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}

                    {user &&
                        <>
                            <div className="my-2 h-px bg-white/10" />
                            {userLinks.map(link => (
                                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                                    <span className="text-zinc-400">{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                            <div className="my-2 h-px bg-white/10" />
                            <button onClick={() => logOutUser()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-medium text-rose-400 transition hover:bg-rose-500/10">
                                {icons.logOut}
                                Log out
                            </button>
                        </>
                    }

                    {!user &&
                        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                            <Link href="/login" className="flex h-10 items-center justify-center rounded-xl border border-white/10 font-medium transition hover:bg-white/5">Log in</Link>
                            <Link href="/signup" className="flex h-10 items-center justify-center rounded-xl bg-linear-to-r from-green-500 to-lime-500 font-semibold transition duration-300 hover:from-green-500 hover:to-lime-600">Sign up</Link>
                        </div>
                    }
                </div>
            }
        </div>
    )
}
