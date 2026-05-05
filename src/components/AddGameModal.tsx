"use client"
import React, { useState } from "react";
import { Dialog } from "radix-ui";
import Link from "next/link";
import { Game } from "@/types/Game";
import { GameStatus } from "@/enums/GameStatus";
import UpdateUserVideogameButton from "./UpdateUserVideogameButton";
import StarButton from "./StarButton";

type Props = {
    game: Game | undefined
};

export default function AddGameModal({ game }: Props) {

    return (
        <div className="w-full flex-col border border-gray-600 px-4 py-12 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-10 top-10 p-2 rounded transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-8">
                <Link href={`gamePage/${game?.id}`} className='relative rounded-2xl overflow-hidden cursor-pointer w-48 h-64'>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game?.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Game cover' />
                </Link>
                <div className="flex flex-col mt-8 sm:mt-0">
                    <p className="text-xl md:text-3xl">{game?.name}</p>
                    <div className="flex space-x-4 mt-2">
                        <div className="flex flex-col">
                            <label className="text-gray-400">Score</label>
                            <input id={'score'} max={10} type="number" className='w-32 rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600 text-right' />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-400">Hours played</label>
                            <input type="number" id={'hoursPlayed'} className='w-32 rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600 text-right' min={0} />
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-2">
                        <div className="flex flex-col">
                            <label className="text-gray-400 mt-2">Status</label>
                            <select className='w-32 rounded bg-gray-800 border border-gray-700 outline-none focus:border-green-600 p-2' id={'status'} defaultValue={GameStatus.PLAYING}>
                                <option value={GameStatus.PLAYING}>{GameStatus.PLAYING}</option>
                                <option value={GameStatus.COMPLETED}>{GameStatus.COMPLETED}</option>
                                <option value={GameStatus.ON_HOLD}>{GameStatus.ON_HOLD}</option>
                                <option value={GameStatus.DROPPED}>{GameStatus.DROPPED}</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-400 mt-2">Favourite</label>
                            <StarButton favourite={true} game_id={game?.id.toString()} />
                        </div>
                    </div>

                    <UpdateUserVideogameButton gameId={game?.id.toString()} />
                </div>
            </div>
        </div>
    )
}