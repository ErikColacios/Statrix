"use client"
import React from "react"
import { Dialog } from "radix-ui"

export default function DeleteGameModal({ listId, gameId, gameName, gameBaseImage, handleRemoveGame }: any) {

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] sm:h-[35vh] border border-gray-600 space-y-4 px-4 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="mt-8 absolute top-0 right-5 p-2 rounded transition hover:bg-gray-800" >
                <svg width="28px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <div className="flex flex-col items-center justify-center text-center sm:text-start sm:flex-row sm:space-x-8">
                <img src={gameBaseImage} className="w-36 h-48 sm:w-32 rounded" alt={'Game cover'} />
                <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center justify-center space-x-2 mt-4 mb-2">
                        <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="17" r="1" fill="#ffffff"></circle> <path d="M12 10L12 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <h2 className="text-2xl">Warning</h2>
                    </div>
                    <p>Are you sure you want to remove <strong>{gameName}</strong> from the list?</p>
                    <div className="flex space-x-8 mt-6">
                        <Dialog.Close onClick={() => handleRemoveGame(listId, gameId)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Remove</Dialog.Close>
                        <Dialog.Close className=" px-6 py-3 rounded-xl border-green-500 text-green-400 hover:bg-green-900/30">
                            Cancel
                        </Dialog.Close>
                    </div>
                </div>
            </div>
        </div>
    )
}