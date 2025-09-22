"use client"
import React, { useEffect, useState, useRef } from "react";
import { FriendshipStatus } from "../enums/FriendshipStatus";
import getUsersFriendship from "../actions/getUsersFriendship";
import Link from "next/link";
import updateUserFriendship from "../actions/updateUserFriendship";

type Props = {
    userId: any
    notificationCount: number
}

export default function Notifications({ userId, notificationCount }: Props) {
    const [dropdown, setDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState([])

    function handleClickOutside(e: MouseEvent) {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
            setDropdown(false);
        }
    };

    async function loadUsers() {
        let users: any = []
        // Get pending friend requests
        users = await getUsersFriendship(FriendshipStatus.PENDING)
        setNotifications(users)
    }

    async function acceptFriendRequest(requester_id: string) {
        if (userId !== null)
            try {
                await updateUserFriendship(requester_id, userId, FriendshipStatus.ACCEPTED)
            } catch (error) {
                console.log(error)
            }
    }

    useEffect(() => {
        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
            loadUsers()
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown])



    return (
        <div ref={dropdownRef}>
            <button className={`relative rounded rounded-full p-2 hover:bg-zinc-700 ${dropdown && "bg-zinc-900"}`} onClick={() => setDropdown(!dropdown)}>
                {notificationCount != 0 &&
                    <span className="text-[10px] text-white absolute w-4 h-4 rounded rounded-full bg-red-600">{notificationCount}</span>}
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>

            {dropdown &&
                <div className="overflow-scroll no-scrollbar left-10 flex flex-col absolute bg-zinc-900 text-sm w-80 h-80 text-gray-200 border border-zinc-600 rounded rounded-lg top-10 space-y-2 z-30 p-2">
                    <p className="text-base ml-2">Notifications</p>
                    {notifications.map((item: any, index: number) => (
                        <div key={index} className='flex p-2 mb-4 h-18 border border-gray-600 bg-zinc-800 rounded-lg'>
                            <div className="w-10 h-10 rounded rounded-full overflow-hidden">
                                <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-3 flex flex-col">
                                <p>New friend request!</p>
                                <Link href={`/profile/${item.user_name}`} className='font-bold hover:text-green-400'>{item.user_name}</Link>
                            </div>
                        <button onClick={()=> acceptFriendRequest(item.requester_id)} 
                                className='m-auto w-16 text-sm p-1 rounded border border-green-500 hover:bg-green-500 hover:text-black'>Accept</button>
                        </div>
                    ))}

                    {notifications.length === 0 && 
                        <div className='flex flex-col items-center justify-center text-center mb-4 h-64 text-gray-400 rounded-lg'>
                            <p>(－_－) zzZ</p>
                            <p>Nothing to check here by now</p>
                        </div>}
                </div>
            }
        </div>
    )
}