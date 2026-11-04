"use client"
import React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import getUsersFriendship from "../actions/getUsersFriendship";
import updateUserFriendship from "../actions/updateUserFriendship";
import { FriendshipStatus } from "../enums/FriendshipStatus";

type Props = {
    userId: string
    notificationCount: number
}

export default function Notifications({ userId, notificationCount }: Props) {
    const [dropdown, setDropdown] = useState(false)
    const [notifications, setNotifications] = useState([])
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handleClickOutside(e: MouseEvent) {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
            setDropdown(false);
        }
    };

    async function loadFriendships() {
        let receivedAndSentRequests: any = []
        // Get pending friend requests
        receivedAndSentRequests = await getUsersFriendship(FriendshipStatus.PENDING)
        setNotifications(receivedAndSentRequests.received)
    }

    async function acceptFriendRequest(requesterId: string, index:number) {
        if (userId !== null)
            try {
                await updateUserFriendship(requesterId, userId, FriendshipStatus.ACCEPTED)
                setNotifications(notifications.filter((notif, i) => i !== index))

                const notificationCountElement = document.getElementById("notificationCount")
                if(notificationCountElement?.textContent) {
                    const newCount:number = parseInt(notificationCountElement.textContent) -1;
                    if (newCount > 0) {
                        notificationCountElement.textContent = newCount.toString()
                    } else {
                        notificationCountElement.remove()
                    }
                }
            } catch (error) {
                console.log(error)
            }
    }

    useEffect(() => {
        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
            loadFriendships()
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown])



    return (
        // On mobile the dropdown is positioned against the navbar (full width), on desktop against the bell
        <div ref={dropdownRef} className="md:relative">
            <button aria-label="Notifications" aria-expanded={dropdown} onClick={() => setDropdown(!dropdown)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/5 hover:text-white ${dropdown ? "bg-white/10 text-white" : "text-zinc-300"}`}>
                {notificationCount != 0 &&
                    <span id="notificationCount" className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-zinc-950">{notificationCount}</span>}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </button>

            {dropdown &&
                <div className="absolute inset-x-0 md:inset-x-auto md:right-0 top-full mt-2 md:mt-3 md:w-80 max-h-96 overflow-y-auto no-scrollbar flex flex-col gap-2 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 text-sm text-zinc-200 shadow-2xl animate-element-appear">
                    <p className="px-2 pt-1 font-semibold text-white">Notifications</p>
                    {notifications.map((notification: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
                            <img src={notification.user_avatar ? `https://media.statrix.app/avatars/${notification.user_id}/${notification.user_avatar}` : "/avatarImages/avatar_default.jpg"} className="h-10 w-10 shrink-0 rounded-full object-cover" alt="Avatar image"/>
                            <div className="flex min-w-0 flex-col">
                                <p className="text-xs text-zinc-400">New friend request</p>
                                <Link href={`/profile/${notification.user_name}`} className="truncate font-semibold hover:text-green-400">{notification.user_name}</Link>
                            </div>
                            <button onClick={() => acceptFriendRequest(notification.requester_id, index)}
                                className="ml-auto shrink-0 rounded-lg bg-linear-to-r from-green-500 to-lime-500 px-3 py-1.5 text-xs font-semibold text-white transition duration-300 hover:from-green-500 hover:to-lime-600">Accept</button>
                        </div>
                    ))}

                    {notifications.length === 0 &&
                        <div className="flex h-40 flex-col items-center justify-center text-center text-zinc-400">
                            <p>(－_－) zzZ</p>
                            <p>Nothing to check here by now</p>
                        </div>}
                </div>
            }
        </div>
    )
}
