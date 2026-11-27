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
                        className={`relative rounded-lg px-3 py-1.5 font-medium transition
                        ${link.isNew
                            // New sections are green to stand out
                            ? active ? "bg-green-500/15 text-green-300" : "text-green-400 hover:bg-green-500/10 hover:text-green-300"
                            : active ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
                        {link.label}
                        {/* "New" badge over the top right corner */}
                        {link.isNew &&
                            <span className="absolute -top-2 -right-2 px-1.5 rounded-full border border-green-500/40 bg-green-500/15 text-[9px] font-bold uppercase leading-4 tracking-wide text-green-400 shadow-sm shadow-green-900/50 pointer-events-none">
                                New
                            </span>}
                    </Link>
                )
            })}
        </div>
    )
}
