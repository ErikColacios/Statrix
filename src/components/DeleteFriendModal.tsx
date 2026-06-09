"use client"
import React from "react"
import { Dialog } from "radix-ui"
import { deleteUserFriendship } from "@/actions/deleteUserFriendship";

export default function DeleteFriendModal({ friend, usersFound, setUsersFound }: any) {

    async function deleteFriend() {
        if (friend.user_id !== null)
            try {
                await deleteUserFriendship(friend.user_id)
                setUsersFound(usersFound.filter((u: any) => u.user_id !== friend.user_id))

                // We simulate that the user presses ESC to close the modal
                const escEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true
                });

                document.dispatchEvent(escEvent);
            } catch (error) {
                console.log(error)
            }
    }

    return (
        <div className="flex flex-col items-center justify-center text-center h-[45vh] border border-gray-600 space-y-4 px-4 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="mt-8 absolute top-0 right-10 p-2 rounded transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <svg width="54px" height="54px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="17" r="1" fill="#ffffff"></circle> <path d="M12 10L12 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            <h2 className="text-3xl">Warning</h2>
            <p>Are you sure you want to delete this friend?</p>

            {/* Deleting friend box */}
            <div className='flex items-center justify-center mb-4 w-1/2 h-16'>
                <div className='flex items-center'>
                    <div className="w-10 h-10 rounded rounded-full overflow-hidden">
                        <img src={`/avatarImages/${friend.avatar_image}`} className="h-full w-full object-cover" alt='Avatar image' />
                    </div>
                    <p className='ml-4 text-lg'>{friend.user_name}</p>
                </div>
            </div>

            <div className="flex space-x-8 mt-12">
                <button onClick={deleteFriend} className="text-md sm:text-lg border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-6 py-3">Delete</button>
                <Dialog.Close className="text-md sm:text-lg text-white px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                    Cancel
                </Dialog.Close>
            </div>
        </div>
    )
}