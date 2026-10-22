"use client"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

const modes = [
    { label: "Browse", url: "statrix.app/mygames", image: "/staticImages/statrix_games.jpg", icon: "/staticImages/icon_controller.png" },
    { label: "Rate", url: "statrix.app/browseGames", image: "/staticImages/statrix_rate.jpg", icon: "/staticImages/icon_star_gray.png" },
    { label: "Lists", url: "statrix.app/mylists", image: "/staticImages/statrix_lists.jpg", icon: "/staticImages/icon_list.png" },
    { label: "Reviews", url: "statrix.app/gamePage", image: "/staticImages/statrix_reviews.jpg", icon: "/staticImages/icon_heart_gray.png" },
    { label: "Chat", url: "statrix.app/chat", image: "/staticImages/statrix_chat.jpg", icon: "/staticImages/icon_friends.png" },
]

// Fake desktop window that previews Statrix. The switch in the title bar changes the whole view.
export default function AppWindow() {
    const [active, setActive] = useState(0)
    const [autoplay, setAutoplay] = useState(true)
    const reduceMotion = useReducedMotion()

    // Cycle through the modes until the user picks one
    useEffect(() => {
        if (!autoplay || reduceMotion) return
        const interval = setInterval(() => setActive((prev) => (prev + 1) % modes.length), 4500)
        return () => clearInterval(interval)
    }, [autoplay, reduceMotion])

    const selectMode = (index: number) => {
        setAutoplay(false)
        setActive(index)
    }

    return (
        <div className="relative">
            <div className="relative overflow-hidden rounded-xl border border-edge bg-card shadow-[0_40px_120px_-30px_rgba(34,197,94,0.35)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2 bg-gradient-to-b from-white/20 via-green-300/5 to-transparent mix-blend-screen" />

                {/* Title bar */}
                <div className="relative flex items-center gap-3 border-b border-edge bg-elevated/60 px-3 py-2.5 sm:px-4">
                    <div className="hidden sm:flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>

                    <div role="tablist" aria-label="Statrix views" className="mx-auto flex overflow-x-auto no-scrollbar rounded-full border border-edge bg-void/80 p-1">
                        {modes.map((mode, index) => (
                            <button key={mode.label} role="tab" aria-selected={active === index} onClick={() => selectMode(index)}
                                className={`relative rounded-full px-3 py-1 text-xs sm:text-sm transition-colors ${active === index ? "text-black" : "text-smoke hover:text-snow"}`}>
                                {active === index &&
                                    <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-lime-400"
                                        transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                                <span className="relative font-medium">{mode.label}</span>
                            </button>
                        ))}
                    </div>

                    <p className="hidden md:block absolute right-4 rounded-md border border-edge bg-void/60 px-3 py-1 text-xs text-smoke">
                        {modes[active].url}
                    </p>
                </div>

                <div className="flex">
                    {/* Pane */}
                    <div className="relative flex-1 aspect-[777/400] bg-black">
                        <AnimatePresence initial={false}>
                            <motion.img key={modes[active].image} src={modes[active].image} alt={`Statrix ${modes[active].label} view`}
                                initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 h-full w-full object-cover" />
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Floating activity toast */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}
                className="hidden md:flex absolute -bottom-6 right-8 z-20 items-center gap-3 rounded-xl border border-edge bg-elevated/90 py-2.5 pl-2.5 pr-5 shadow-2xl backdrop-blur">
                <img src="/avatarImages/doom_slayer.jpg" alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="text-sm">
                    <p className="text-snow"><span className="font-semibold">DrStorm</span> <span className="text-smoke">started playing</span></p>
                    <p className="text-smoke">Kingdom Hearts 3 · <span className="text-green-400">2m</span></p>
                </div>
            </motion.div>
        </div>
    )
}
