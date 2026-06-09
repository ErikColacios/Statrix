"use client"
import React, { useState } from "react";
import { Dialog } from "radix-ui";
import getUserSearched from "../actions/getUserSearched";
import Link from "next/link";
import { insertUserFriendship } from "../actions/insertUserFriendship";
import { FriendshipStatus } from "@/enums/FriendshipStatus";
import updateUserFriendship from "@/actions/updateUserFriendship";

export default function AddNewFriendModal() {

    const [usersFound, setUsersFound] = useState([])

    async function searchUser(formData: FormData) {
        const searchedUser: string = formData.get('searchUser') as string
        let users: any = []

        if (searchedUser !== "") {
            users = await getUserSearched(searchedUser)
            setUsersFound(users)
            console.log(users)
        }
    }

    async function sendFriendRequest(addressee_id: string, addressee_name: string, status: FriendshipStatus | null) {
        if (addressee_id !== null && addressee_name !== null)
            try {
                if (status === FriendshipStatus.REJECTED) {
                    await updateUserFriendship(undefined, addressee_id, FriendshipStatus.PENDING)
                } else {
                    await insertUserFriendship(addressee_id, addressee_name)
                }
            
                const addFriendButton = document.getElementById("addFriendButton" + addressee_id) as HTMLButtonElement
                const requestSentText = document.getElementById("requestSentText" + addressee_id) as HTMLParagraphElement
                addFriendButton.classList.add("hidden")
                requestSentText.classList.remove("hidden")
            } catch (error) {
                console.log(error)
            }
    }

    return (
        <div className="flex w-full h-[75vh] md:h-[65vh] flex-col border border-gray-600 space-y-8 pl-4 pr-4 md:pl-10 md:pr-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="mt-8 absolute right-10 p-2 rounded transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <h2 className="text-3xl">Search user</h2>
            <p className="text-gray-300">Search a friend typing the user name here</p>
            {/* Search user */}
            <div className="flex">
                <form className='flex text-sm border' action={searchUser}>
                    <input type="text" name="searchUser" id="searchUser" className='w-full rounded pl-2 sm:w-32 lg:w-full bg-transparent outline-none' placeholder='User name' />
                    <button className='p-1 rounded ml-2 transition hover:bg-gray-700' type='submit'><img src="/staticImages/icon_search.png" alt="Search button" className='w-5' width={20} height={20} /></button>
                </form>
                <div className="loader-small ml-3 hidden" id="loader"></div>
            </div>

            <div className='mt-5 overflow-scroll no-scrollbar'>
                {/* Users found */}
                {usersFound.map((item: any, index: number) => (
                    <div key={index} className='relative flex items-center mb-4 p-2 h-18 space-x-4 border border-gray-600 bg-gray-800/50 rounded-lg'>
                        <div className="w-12 h-12 rounded rounded-full overflow-hidden">
                            <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" alt="Avatar image" />
                        </div>
                        <Link href={`/profile/${item.user_name}`} className='text-lg hover:text-green-400'>{item.user_name}</Link>
                        <div className='flex items-center pl-8 space-x-10 text-base text-gray-400'>
                            <p>{item.user_location}</p>
                            {/* <p>Joined: {item.user_creationdate.toISOString().split('T')[0]}</p> */}
                            { item.status == FriendshipStatus.PENDING &&<p>{item.status}</p> }
                        </div>

                        {/* Add friend button */}
                        {(item.status === null || item.status == FriendshipStatus.REJECTED) &&
                        <div className="absolute right-5 flex items-center space-x-4">
                            <p className='text-green-500 hidden' id={"requestSentText"+item.user_id}>Request sent!</p>
                            <button id={'addFriendButton'+item.user_id} className='p-2 rounded rounded-full hover:bg-zinc-700'
                                onClick={() => sendFriendRequest(item.user_id, item.user_name, item.status)}>
                                <svg width="20px" height="20px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="5.4399999999999995" stroke="#ffffff" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><circle cx="29.22" cy="16.28" r="11.14"></circle><path d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9"></path><circle cx="45.38" cy="46.92" r="11.94"></circle><line x1="45.98" y1="39.8" x2="45.98" y2="53.8"></line><line x1="38.98" y1="46.8" x2="52.98" y2="46.8"></line></g></svg></button>
                            </div>
                        }
                    </div>
                ))}
                {usersFound.length === 0 &&
                    <div className='flex items-center justify-center bg-gray-800/50 text-gray-400 border border-gray-600 rounded-lg mb-4 h-80 p-4'>
                        Here you will see the users found in the database
                    </div>}
            </div>
        </div>
    )
}