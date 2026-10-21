"use client"
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import getUserSearched from "../actions/getUserSearched";
import Link from "next/link";
import { insertUserFriendship } from "../actions/insertUserFriendship";
import { FriendshipStatus } from "@/enums/FriendshipStatus";
import updateUserFriendship from "@/actions/updateUserFriendship";

export default function AddNewFriendModal() {

    const [search, setSearch] = useState("")
    const [usersFound, setUsersFound] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [sentRequests, setSentRequests] = useState<string[]>([])
    const [sendingId, setSendingId] = useState<string | null>(null)
    const latestSearch = useRef("")

    // Searches while the user types, waiting 300ms after the last key press
    useEffect(() => {
        const term = search.trim()
        latestSearch.current = term

        if (term === "") {
            setUsersFound([])
            setLoading(false)
            return
        }

        setLoading(true)
        const timer = setTimeout(async () => {
            try {
                const users = await getUserSearched(term)
                // Ignore the response if the user kept typing
                if (latestSearch.current !== term) return
                setUsersFound(users)
                setError(false)
            } catch (error) {
                console.log(error)
                if (latestSearch.current === term) setError(true)
            } finally {
                if (latestSearch.current === term) setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    async function sendFriendRequest(addressee_id: string, addressee_name: string, status: FriendshipStatus | null) {
        if (addressee_id === null || addressee_name === null) return

        setSendingId(addressee_id)
        try {
            if (status === FriendshipStatus.REJECTED) {
                await updateUserFriendship(undefined, addressee_id, FriendshipStatus.PENDING)
            } else {
                await insertUserFriendship(addressee_id, addressee_name)
            }
            setSentRequests((prev) => [...prev, addressee_id])
        } catch (error) {
            console.log(error)
        } finally {
            setSendingId(null)
        }
    }

    // Right side of each user row, depending on the friendship status
    function renderUserAction(item: any) {
        if (sentRequests.includes(item.user_id)) {
            return <StatusBadge className="text-green-400 border-green-500/30 bg-green-500/10">Request sent</StatusBadge>
        }
        if (item.status === FriendshipStatus.ACCEPTED) {
            return <StatusBadge className="text-green-400 border-green-500/30 bg-green-500/10">Friends</StatusBadge>
        }
        if (item.status === FriendshipStatus.PENDING) {
            return <StatusBadge className="text-zinc-300 border-white/10 bg-white/5">{item.requester_id === item.user_id ? "Sent you a request" : "Request sent"}</StatusBadge>
        }
        if (item.status === FriendshipStatus.BLOCKED) {
            return <StatusBadge className="text-zinc-500 border-white/10 bg-white/5">Blocked</StatusBadge>
        }
        return (
            <button onClick={() => sendFriendRequest(item.user_id, item.user_name, item.status)} disabled={sendingId === item.user_id}
                className="shrink-0 flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300 disabled:opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" /></svg>
                <span className="hidden sm:inline">Add</span>
            </button>
        )
    }

    return (
        <div className="relative w-full h-full sm:h-auto flex flex-col sm:border border-white/15 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl">

            {/* Subtle green glow backdrop */}
            <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
            </div>

            <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Dialog.Close>

            <div className="relative flex flex-col gap-6 px-4 pt-24 pb-8 sm:py-8 md:p-10 min-h-0 flex-1">
                {/* Header */}
                <div className="flex items-center gap-4 pr-10">
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-green-500/15 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Add friend</h2>
                        <p className="text-sm text-zinc-400">Find other players by their user name.</p>
                    </div>
                </div>

                {/* Search user */}
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input type="text" name="searchUser" id="searchUser" autoFocus autoComplete="off" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-11 pr-12 rounded-xl bg-white/5 border border-white/10 outline-hidden placeholder:text-zinc-600 transition focus:border-green-500 focus:bg-white/10"
                        placeholder="User name" />
                    {loading && <div className="loader-small absolute right-4 top-1/2 -translate-y-1/2" />}
                </div>

                {/* Users found */}
                <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar min-h-0 flex-1 sm:flex-none sm:h-80">
                    {usersFound.map((item: any) => (
                        <div key={item.user_id} className="flex items-center gap-4 p-3 sm:px-4 rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10">
                            <Link href={`/profile/${item.user_name}`} className="shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
                                <img src={item.user_avatar ? `https://media.statrix.app/avatars/${item.user_id}/${item.user_avatar}` : "/avatarImages/avatar_default.jpg"} className="h-full w-full object-cover" alt="Avatar image" />
                            </Link>
                            <div className="min-w-0 flex-1">
                                <Link href={`/profile/${item.user_name}`} className="block font-semibold truncate hover:text-green-400">{item.user_name}</Link>
                                {item.user_location && <p className="text-xs text-zinc-400 truncate">{item.user_location}</p>}
                            </div>
                            {renderUserAction(item)}
                        </div>
                    ))}

                    {/* Empty states */}
                    {usersFound.length === 0 && (
                        <div className="flex flex-1 sm:h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-400">
                            {error ? (
                                <p className="text-rose-400">Something went wrong searching users. Try again.</p>
                            ) : search.trim() !== "" && !loading ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" /></svg>
                                    <p>No users found for <b className="text-white">&quot;{search.trim()}&quot;</b></p>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    <p>Start typing to find players</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ children, className }: { children: React.ReactNode, className: string }) {
    return (
        <span className={`shrink-0 px-3 py-1 rounded-full border text-xs font-medium ${className}`}>{children}</span>
    )
}
