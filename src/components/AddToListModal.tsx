"use client"
import React, { useState } from "react";
import { Dialog } from "radix-ui";
import updateListOneGame from "../actions/updateListOneGame";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";

type Props = {
    game_id: string,
    game_name: string,
    game_cover: string,
    lists:any[]
};

export default function AddToListModal({ game_id, game_name, game_cover, lists }: Props) {

    const handleAddToList = async () => {
        const selectedListId: string = (document.getElementById("selectList") as HTMLSelectElement).value;

        // We update the list adding only this one game
        await updateListOneGame(selectedListId, game_id, game_name, game_cover);

        // We simulate that the user presses ESC to close the modal
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true
        });

        document.dispatchEvent(escEvent);
    }

    return (
        <div className="flex relative w-full h-[75vh] md:h-[65vh] flex-col border border-gray-500 space-y-8 pl-4 pr-4 md:pl-10 md:pr-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="mt-8 absolute right-10 p-2 rounded-sm transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <h2 className="text-3xl">Add to list</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start md:pt-12">
                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game_cover}.png`} alt="Videogame cover" className="w-36 lg:w-48 rounded-sm" />
                <div className="flex flex-col w-full md:ml-8">
                    {lists.length !== 0 ? 
                        <select className='w-full md:w-96 bg-black border border-gray-500 outline-hidden focus:border-green-500 mt-8 md:mt-2 p-2 rounded-sm' id='selectList' >
                        {lists.map((list:any, index:number) =>(
                            <option key={index} value={list.list_id}>{list.list_name}</option>
                        ))}
                    </select> 
                    : <div className='flex w-full h-64 items-center justify-center rounded-sm bg-black text-white border border-gray-600'>
                        <div className="flex flex-col text-center items-center">
                            <p className="text-xl mb-4">You have no lists yet, create one!</p>
                            <Link href={"/newList"} className="w-full text-md md:text-xl p-2 md:p-4 bg-green-500 transition hover:bg-green-600">Create list</Link>
                        </div>
                    </div>}

                </div>
            </div>
            <div className="absolute right-5 md:right-10 bottom-10" onClick={() => handleAddToList()}>
                {lists.length !== 0 && <PrimaryButton text="Save game"/> }
            </div>
        </div>
    )
}