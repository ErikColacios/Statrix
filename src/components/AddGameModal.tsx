"use client"
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import Link from "next/link";
import { GameStatus } from "@/enums/GameStatus";
import StarButton from "./StarButton";
import getUserVideogame from "@/actions/getUserVideogame";
import updateUserVideogame from "@/actions/updateUserVideogame";

type Props = {
    game: any
};

export default function AddGameModal({ game }: Props) {

    const [userGameInfo, setUserGameInfo] = useState<any>([])
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()

    useEffect(() => {
        const fetchUserGame = async() => {
            setUserGameInfo(await getUserVideogame(game.id))
        }
        fetchUserGame()
    }, [])

    useEffect(() => {
        setSelectedStatus(userGameInfo[0]?.status)
        // if (selectedStatus === GameStatus.PLAYING) {
        //     playingButtonRef.current?.focus();
        // }
        // else if (selectedStatus === GameStatus.COMPLETED) {
        //     completedButtonRef.current?.focus();
        // }
        // else if (selectedStatus === GameStatus.ON_HOLD) {
        //     onholdButtonRef.current?.focus();
        // }
        // else if (selectedStatus === GameStatus.DROPPED) {
        //     droppedButtonRef.current?.focus();
        // }
    }, [userGameInfo])
    

    async function handleSaveUserGame(){
        //const newStatus: string = (document.getElementById("status") as HTMLSelectElement).value
        const newStatus: string | undefined = selectedStatus
        const newScore: number = (document.getElementById("score") as HTMLInputElement).valueAsNumber
        const newHoursPlayed: number = (document.getElementById("hoursPlayed") as HTMLInputElement).valueAsNumber
        
        if(game.id)
            await updateUserVideogame(game.id, newStatus, newScore, newHoursPlayed, game.name, game.game_base_image);
    }
    

    return (
        <div className="w-full flex-col border border-gray-600 px-4 py-12 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-10 top-10 p-2 rounded transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-8">
                <Link href={`gamePage/${game?.id}`} className='relative w-48 h-64 rounded-2xl overflow-hidden cursor-pointer transition hover:opacity-85'>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game?.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Game cover' />
                </Link>
                <div className="flex flex-col mt-8 sm:mt-0">
                    <p className="text-xl md:text-3xl">{game?.name}</p>
                    <div className="flex space-x-4 mt-6">
                        <div className="flex flex-col">
                            <label className="text-gray-400">Score</label>
                            <input id={'score'} max={10} type="number" className='w-32 rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600 text-right' 
                            defaultValue={userGameInfo[0] ? userGameInfo[0].score : ""} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-400">Hours played</label>
                            <input type="number" id={'hoursPlayed'} className='w-32 rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600 text-right' min={0} 
                                defaultValue={userGameInfo[0] ? userGameInfo[0].hours_played : ""} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-400">Favourite</label>
                            <StarButton favourite={true} game_id={game.id} />
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-2">
                        <div className="flex flex-col">
                            <label className="text-gray-400 mt-2">Status</label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={()=> setSelectedStatus(GameStatus.PLAYING)} 
                                    className={selectedStatus===GameStatus.PLAYING
                                        ? "bg-gradient-to-r from-teal-500 to-blue-500 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                        : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    }>{GameStatus.PLAYING}</button>

                                <button
                                    onClick={()=> setSelectedStatus(GameStatus.COMPLETED)} 
                                    className={selectedStatus===GameStatus.COMPLETED
                                        ? "bg-gradient-to-r from-green-500 to-lime-500 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                        : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    }>{GameStatus.COMPLETED}</button>
                                <button
                                    onClick={()=> setSelectedStatus(GameStatus.ON_HOLD)} 
                                    className={selectedStatus===GameStatus.ON_HOLD
                                        ? "bg-gradient-to-r from-indigo-600 to-blue-500 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                        : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    }>{GameStatus.ON_HOLD}</button>

                                <button
                                    onClick={()=> setSelectedStatus(GameStatus.DROPPED)} 
                                    className={selectedStatus===GameStatus.DROPPED
                                        ? "bg-gradient-to-r from-red-600 to-orange-700 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                        : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    }>{GameStatus.DROPPED}</button>
                            </div>
                        </div>
                    </div>

                    {/* <UpdateUserVideogameButton game={game} /> */}
                    <Dialog.Close className="text-white px-6 py-2 mt-4 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                    onClick={handleSaveUserGame} >
                        Save
                    </Dialog.Close>
                </div>
            </div>
        </div>
    )
}