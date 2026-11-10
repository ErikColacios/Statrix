"use client"
import React, { useState } from "react"
import Link from "next/link"
import { HoverCard } from "radix-ui"
import getUserCard from "@/actions/getUserCard"
import { UserCard } from "@/types/UserCard"

type Props = {
    userName: string
    children: React.ReactNode // The element that opens the card on hover, usually a link to the profile
}

// Requests of the users, shared by all the cards of the page (e.g. the avatar and the name of the same user).
// The promise is stored, not the result, so two cards opened at the same time share one request
const userCache = new Map<string, Promise<UserCard | null>>()

function fetchUserCard(userName: string): Promise<UserCard | null> {
    if (!userCache.has(userName)) {
        userCache.set(userName, getUserCard(userName).then((res) => res.success && res.user ? res.user : null))
    }
    return userCache.get(userName)!
}

// Shows a floating card with the banner, avatar, name and bio of a user when hovering over the children
export default function UserHoverCard({ userName, children }: Props) {
    const [user, setUser] = useState<UserCard | null | undefined>(undefined)

    async function handleOpenChange(open: boolean) {
        if (!open || user !== undefined) return
        // Always reads from the cache, even if another card already requested this user
        setUser(await fetchUserCard(userName))
    }

    return (
        <HoverCard.Root openDelay={300} closeDelay={150} onOpenChange={handleOpenChange}>
            <HoverCard.Trigger asChild>
                {children}
            </HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content side="bottom" align="start" sideOffset={8} collisionPadding={16}
                    className="z-[100] w-80 overflow-hidden rounded-2xl border border-edge bg-card text-snow shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]
                    data-[state=open]:animate-[dialog-content-show_150ms] data-[state=closed]:animate-[dialog-content-hide_150ms]">

                    {/* Loading */}
                    {user === undefined && (
                        <div>
                            <div className="h-24 bg-elevated animate-pulse" />
                            <div className="px-4 pb-4">
                                <div className="-mt-9 h-18 w-18 rounded-full border-4 border-card bg-elevated animate-pulse" />
                                <div className="mt-3 h-5 w-1/2 rounded-md bg-elevated animate-pulse" />
                                <div className="mt-2 h-4 w-full rounded-md bg-elevated animate-pulse" />
                            </div>
                        </div>
                    )}

                    {/* User not found */}
                    {user === null && (
                        <p className="p-4 text-sm text-smoke">This user doesn&apos;t exist anymore.</p>
                    )}

                    {user && (
                        <div>
                            {/* Same default banner as the profile page */}
                            <img src={user.user_banner ? `https://media.statrix.app/banners/${user.user_id}/${user.user_banner}` : "/bannerImages/banner_default.jpg"}
                                alt="Banner image" className="h-24 w-full border-b border-white/10 object-cover" />
                            <div className="px-4 pb-4">
                                <div className="flex items-end justify-between">
                                    <img src={user.user_avatar ? `https://media.statrix.app/avatars/${user.user_id}/${user.user_avatar}` : "/avatarImages/avatar_default.jpg"}
                                        alt="Avatar image" className="-mt-9 h-18 w-18 rounded-full border-4 border-card object-cover" />
                                    <Link href={`/profile/${user.user_name}`}
                                        className="mb-1 rounded-full border border-edge bg-white/[0.03] px-3 py-1 text-xs font-medium text-smoke transition hover:border-green-500/40 hover:text-snow">
                                        View profile
                                    </Link>
                                </div>
                                <Link href={`/profile/${user.user_name}`} className="mt-2 block truncate text-lg font-bold transition hover:text-green-400">{user.user_name}</Link>
                                <p className="text-xs text-smoke">
                                    Joined {new Date(user.user_creationdate).toLocaleDateString()}
                                    {user.user_location && ` · ${user.user_location}`}
                                </p>
                                {user.user_bio && <p className="mt-3 text-sm text-zinc-300 line-clamp-3">{user.user_bio}</p>}
                            </div>
                        </div>
                    )}
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    )
}
