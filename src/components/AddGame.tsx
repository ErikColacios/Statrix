"use client"
import React, { useEffect, useRef, useState } from "react";
import { GameStatus } from "@/enums/GameStatus";
import StarButton from "./StarButton";
import getUserVideogame from "@/actions/getUserVideogame";
import updateUserVideogame from "@/actions/updateUserVideogame";
import { Game } from "@/types/Game";
import { useSession } from "next-auth/react";

type Props = {
    game: Game
};

export default function AddGame({ game }: Props) {

    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [userGameInfo, setUserGameInfo] = useState<any>([])
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)

    useEffect(() => {
        if (userId === undefined) return;
        const fetchUserGame = async() => {
            setUserGameInfo(await getUserVideogame(game.id))
        }
        fetchUserGame()
    }, [])

    useEffect(() => {
        setSelectedStatus(userGameInfo[0]?.status)
        setStarred(userGameInfo[0]?.favourite)
    }, [userGameInfo])
    
    // Passed to StarButton
    function handleStarred() {
        setStarred(!starred)
    }

    async function handleSaveUserGame(){
        const newScore: number = (document.getElementById("score") as HTMLInputElement).valueAsNumber
        const newHoursPlayed: number = (document.getElementById("hoursPlayed") as HTMLInputElement).valueAsNumber
        if(game.id)
            await updateUserVideogame(game.id, selectedStatus, newScore, newHoursPlayed, starred, game.name, game.game_image_id);
    }

    return (
        <div className="flex flex-col justify-center items-center bg-zinc-900 border border-zinc-600 md:items-start p-3 md:p-6 rounded-2xl">
            <p className="text-base text-gray-200 mb-2">Your statistics</p>
            <span className="w-full bg-zinc-600 h-px mb-2"></span>
            <div className="flex flex-col space-y-3">
                <div className="flex space-x-4">
                    <div className="flex flex-col">
                        <label className="text-gray-400">Score</label>
                        <input id={'score'} max={10} type="number" className='w-full rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600 text-right' 
                        defaultValue={userGameInfo[0]?.score !='NaN' ? userGameInfo[0]?.score : ""} />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-400">Hours played</label>
                        <input type="number" id={'hoursPlayed'} className='w-full rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600 text-right' min={0} 
                            defaultValue={userGameInfo[0]?.hours_played !='NaN' ? userGameInfo[0]?.hours_played : ""} />
                    </div>
                </div>
                    <div className="flex flex-col">
                        <label className="text-gray-400 mt-2">Status</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={()=> setSelectedStatus(GameStatus.PLAYING)} 
                                className={selectedStatus === GameStatus.PLAYING
                                    ? "bg-gradient-to-r from-teal-500 to-blue-500 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                }>{GameStatus.PLAYING}</button>

                            <button
                                onClick={()=> setSelectedStatus(GameStatus.COMPLETED)} 
                                className={selectedStatus === GameStatus.COMPLETED
                                    ? "bg-gradient-to-r from-green-500 to-lime-500 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                }>{GameStatus.COMPLETED}</button>
                            <button
                                onClick={()=> setSelectedStatus(GameStatus.ON_HOLD)} 
                                className={selectedStatus === GameStatus.ON_HOLD
                                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                }>{GameStatus.ON_HOLD}</button>

                            <button
                                onClick={()=> setSelectedStatus(GameStatus.DROPPED)} 
                                className={selectedStatus === GameStatus.DROPPED
                                    ? "bg-gradient-to-r from-red-600 to-orange-700 rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                    : "rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                }>{GameStatus.DROPPED}</button>
                        </div>
                    </div>
                <div className="flex items-center space-x-4">
                    <label className="text-gray-400">Favourite</label>
                    <StarButton handleStarred={handleStarred} favourite={starred} gameId={game.id}/>
                </div>

                <button className="px-6 py-2 text-center rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                    onClick={handleSaveUserGame} >
                    Save game
                </button>
            </div>
        </div>
    )
}