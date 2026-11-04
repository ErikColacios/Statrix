"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveLink, mainLinks } from "./navbarItems";

// Desktop links, the one of the current page is highlighted
export default function NavbarLinks({ isLogged }: { isLogged: boolean }) {
    const pathname = usePathname()

    return (
        <div className="flex items-center gap-1">
            {mainLinks.filter(link => isLogged || !link.requiresSession).map(link => {
                const active = isActiveLink(pathname, link.href)
                return (
                    <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}
                        className={`rounded-lg px-3 py-1.5 font-medium transition ${active ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                        {link.label}
                    </Link>
                )
            })}
        </div>
    )
}
