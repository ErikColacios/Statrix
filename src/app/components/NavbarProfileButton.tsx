"use client"
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function NavbarProfileButton({userName, avatarImage, handleLogOut}:any){
    const [dropdown, setDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const handleClickOutside = (e:MouseEvent) => {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
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
        <div ref={dropdownRef}>
            <button onClick={()=> setDropdown(!dropdown)} className="relative flex justify-center items-center bg-zinc-900 border border-green-500 w-32 rounded rounded-2xl pt-1 pb-1 text-center mr-2 md:mr-4 transition hover:bg-green-500 hover:text-black">
                <div className="absolute left-0 w-8 rounded rounded-full overflow-hidden mr-2">
                    <img src={`/avatarImages/${avatarImage}`} className="h-full w-full object-cover"/>
                </div>
                <p>{userName}</p>
            </button>

            { dropdown && <div  className="flex flex-col absolute bg-zinc-900/90 backdrop-blur-lg text-sm w-36 text-gray-200 border border-green-500 rounded rounded-lg top-10 space-y-2 z-40 right-2 p-4">
                <Link href="/profile" className="flex items-center hover:text-green-400">
                    <svg className="mr-1" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="#ffffff" strokeWidth="1.7280000000000002"></path> <path d="M21 9L3 9" stroke="#ffffff" strokeWidth="1.7280000000000002" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 21L9 9" stroke="#ffffff" strokeWidth="1.7280000000000002" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>                    My profile
                </Link>
                <Link href="/mylists" className="flex items-center hover:text-green-400">
                    <svg className="mr-1" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 16H3" stroke="#ffffff" strokeWidth="2.112" strokeLinecap="round"></path> <path d="M9 11H3" stroke="#ffffff" strokeWidth="2.112" strokeLinecap="round"></path> <path d="M16.4901 16.3082L16.935 15.7045L16.935 15.7045L16.4901 16.3082ZM17.5 10.1062L16.9641 10.6309C17.1052 10.775 17.2983 10.8562 17.5 10.8562C17.7017 10.8562 17.8948 10.775 18.0359 10.6309L17.5 10.1062ZM18.5099 16.3083L18.9549 16.912L18.9549 16.912L18.5099 16.3083ZM17.5 16.8103L17.5 16.0603H17.5L17.5 16.8103ZM16.935 15.7045C16.2914 15.2302 15.4675 14.5568 14.8118 13.808C14.1328 13.0325 13.75 12.3064 13.75 11.7148H12.25C12.25 12.8758 12.9489 13.9574 13.6832 14.7961C14.4409 15.6614 15.3619 16.4085 16.0451 16.912L16.935 15.7045ZM13.75 11.7148C13.75 10.607 14.2445 10.0237 14.7533 9.83348C15.2705 9.6401 16.0951 9.74331 16.9641 10.6309L18.0359 9.58145C16.88 8.40091 15.4546 7.96984 14.228 8.42849C12.993 8.89028 12.25 10.1453 12.25 11.7148H13.75ZM18.9549 16.912C19.6381 16.4085 20.5591 15.6614 21.3168 14.7961C22.0511 13.9574 22.75 12.8758 22.75 11.7148H21.25C21.25 12.3064 20.8672 13.0326 20.1882 13.808C19.5325 14.5568 18.7086 15.2302 18.065 15.7045L18.9549 16.912ZM22.75 11.7148C22.75 10.1453 22.007 8.89027 20.772 8.42849C19.5454 7.96985 18.12 8.40091 16.9641 9.58145L18.0359 10.6309C18.9049 9.74331 19.7295 9.6401 20.2467 9.83348C20.7555 10.0237 21.25 10.607 21.25 11.7148H22.75ZM16.0451 16.912C16.4368 17.2007 16.8752 17.5603 17.5 17.5603L17.5 16.0603C17.4852 16.0603 17.4682 16.0626 17.399 16.0252C17.3008 15.972 17.178 15.8836 16.935 15.7045L16.0451 16.912ZM18.065 15.7045C17.822 15.8836 17.6992 15.972 17.601 16.0252C17.5318 16.0626 17.5148 16.0603 17.5 16.0603L17.5 17.5603C18.1248 17.5603 18.5632 17.2007 18.9549 16.912L18.065 15.7045Z" fill="#ffffff"></path> <path d="M20 6L9.5 6M3 6L5.25 6" stroke="#ffffff" strokeWidth="2.112" strokeLinecap="round"></path> </g></svg>
                    My lists
                </Link>
                <Link href="/settings" className="flex items-center hover:text-green-400">
                <svg className="mr-1" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#ffffff"></path> </g></svg>
                    Settings
                </Link>
                <button className="flex items-center hover:text-green-400 text-left" onClick={()=> handleLogOut()}>
                    <svg className="mr-1" width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2a1 1 0 1 1-2 0V6H4v12h9v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm15.293 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L18.586 13H9a1 1 0 1 1 0-2h9.586l-1.293-1.293a1 1 0 0 1 0-1.414z" fill="#ffffff"></path></g></svg>
                    Log out
                </button>
            </div>
            }
        </div>
    )
}