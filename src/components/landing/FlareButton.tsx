"use client"
import React from "react"
import Link from "next/link"

// Pill button with a rotating conic-gradient border and a glow that follows the cursor
export default function FlareButton({ href, children }: { href: string, children: React.ReactNode }) {

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty("--glow-x", `${e.clientX - rect.left}px`)
        e.currentTarget.style.setProperty("--glow-y", `${e.clientY - rect.top}px`)
    }

    return (
        <Link href={href} onMouseMove={handleMouseMove}
            className="group relative inline-flex justify-center overflow-hidden rounded-full p-px shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)]">
            <span aria-hidden="true"
                className="absolute top-1/2 left-1/2 aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 animate-flare-rotate motion-reduce:animate-none"
                style={{ background: "conic-gradient(from 0deg, #22c55e, #a3e635, #f0fff4, #22d3ee, #10b981, #84cc16, #22c55e)" }} />
            <span className="relative w-full overflow-hidden rounded-full bg-void px-7 py-3 text-center font-semibold text-snow">
                <span aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(120px circle at var(--glow-x) var(--glow-y), rgba(74,222,128,0.35), transparent 70%)" }} />
                <span className="relative">{children}</span>
            </span>
        </Link>
    )
}
