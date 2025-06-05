"use client"
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function NavbarProfileButton({userName, avatarImage, handleLogOut}:any){
    const [dropdown, setDropdown] = useState(false)
    const dropdownRef = useRef<HTMLButtonElement>(null);
    
    const handleClickOutside = (e:MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setDropdown(false);
        }
     };

    useEffect(() => {
        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown])
    

    return(
        <>
            <button ref={dropdownRef} onClick={()=> setDropdown(!dropdown)} className="relative flex justify-center items-center bg-zinc-900 border border-green-500 w-32 rounded rounded-2xl pt-1 pb-1 text-center mr-2 md:mr-4 transition hover:bg-green-500 hover:text-black">
                <div className="absolute left-0 w-8 rounded rounded-full overflow-hidden mr-2">
                    <img src={`/avatarImages/${avatarImage}`} className="h-full w-full object-cover"/>
                </div>
                <p>{userName}</p>
            </button>

            { dropdown && <div  className="flex flex-col absolute bg-zinc-900/90 backdrop-blur-lg text-sm w-36 text-gray-200 border border-green-500 rounded rounded-lg top-10 space-y-2 z-40 right-2 p-4">
                <Link href="/profile" className="hover:text-green-400">My profile</Link>
                <Link href="/mylists" className="hover:text-green-400">My lists</Link>
                <Link href="/settings" className="hover:text-green-400">Settings</Link>
                <button className="hover:text-green-400 text-left" onClick={()=> handleLogOut()}>Log out</button>
            </div>
            }
        </>
    )
}