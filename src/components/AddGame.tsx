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

    const [userGameInfo, setUserGameInfo] = useState<any>([])
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)
    const [hoursPlayed, setHoursPlayed] = useState<string>("0")
    const [score, setScore] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserGame = async () => {
            setUserGameInfo(await getUserVideogame(game.id))
        }
        fetchUserGame()
    }, [])

    useEffect(() => {
        if (userGameInfo.length > 0) {
            setSelectedStatus(userGameInfo[0]?.status)
            setStarred(userGameInfo[0]?.favourite)
            setScore(userGameInfo[0]?.score)
            setHoursPlayed(userGameInfo[0]?.hours_played)
        }
    }, [userGameInfo])

    // Passed to StarButton
    function handleStarred() {
        setStarred(!starred)
    }


    async function handleScoreChange(e: React.ChangeEvent<HTMLInputElement>) {
        const valueScore = parseFloat(e.target.value)
        setScore(valueScore)
        // if (valueScore >= 8) {
        //     setScoreColor("green")
        // } else if (valueScore >= 4) {
        //     setScoreColor("yellow")
        // } else if (valueScore < 4) {
        //     setScoreColor("red")
        // } else if (valueScore === 0) {
        //     setScoreColor("none")
        // }
    }

    function handleHoursPlayedChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value !== "") {
            const valueHoursPlayed = parseFloat(e.target.value)
            if (valueHoursPlayed < 0) {
                setHoursPlayed("0")
            } else if (valueHoursPlayed > 100000) {
                setHoursPlayed("")
            } else {
                setHoursPlayed(valueHoursPlayed.toString());
            }
        } else {
            setHoursPlayed("0")
        }
    }

    async function handleSaveUserGame() {
        if (game.id) {
            const res = await updateUserVideogame(game.id, selectedStatus, Number(score), Number(hoursPlayed), starred, game.name, game.game_image_id);
            if (res?.success) {
                setError(null)
                setSuccess(res?.message || "Game info updated successfully.")
            } else {
                setError(res?.message || "There was an error saving the game info.")
                setSuccess(null)
            }
        }
    }

    return (
        <div className="flex flex-col justify-center">
            <p className="text-right text-gray-200 mb-2">Your stats</p>
            <span className="w-full bg-zinc-600 h-px mb-2"></span>
            <div className="flex flex-col space-y-3">
                <div className="flex space-x-4">
                    <div className="w-1/2 flex flex-col">
                        <label className="text-gray-400">Score</label>
                        <div className={`flex items-center justify-center sm:justify-start space-x-2 relative group`}>
                            <span id={'scoreText'}
                                className={`flex hover:bg-zinc-800 transition cursor-pointer items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-gray-500 p-1 text-xl font-bold
                            `}>{score}</span>
                            {score == 0 && <p className="group-hover:hidden absolute ml-8 sm:left-15 text-xs"> Drag to rate</p>}

                            <input min="0" max="10" value={score} className="rangeSlider" type="range" onChange={handleScoreChange}></input>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <label className="text-gray-400">Hours played</label>
                        <input type="number" id={'hoursPlayed'} onChange={handleHoursPlayedChange} className='rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right' min={0}
                            value={hoursPlayed} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-400 mt-2">Status</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSelectedStatus(GameStatus.PLAYING)}
                            className={selectedStatus === GameStatus.PLAYING
                                ? "bg-linear-to-r from-teal-500 to-blue-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>{GameStatus.PLAYING}</button>

                        <button
                            onClick={() => setSelectedStatus(GameStatus.COMPLETED)}
                            className={selectedStatus === GameStatus.COMPLETED
                                ? "bg-linear-to-r from-green-500 to-lime-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>{GameStatus.COMPLETED}</button>
                        <button
                            onClick={() => setSelectedStatus(GameStatus.ON_HOLD)}
                            className={selectedStatus === GameStatus.ON_HOLD
                                ? "bg-linear-to-r from-indigo-600 to-blue-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>{GameStatus.ON_HOLD}</button>

                        <button
                            onClick={() => setSelectedStatus(GameStatus.DROPPED)}
                            className={selectedStatus === GameStatus.DROPPED
                                ? "bg-linear-to-r from-red-600 to-orange-700 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>{GameStatus.DROPPED}</button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <label className="text-gray-400">Favourite</label>
                    <StarButton handleStarred={handleStarred} favourite={starred} gameId={game.id} />
                </div>

                <button className="px-6 py-2 text-center rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                    onClick={handleSaveUserGame} >
                    Save game
                </button>
                <div className="text-center">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                </div>
            </div>
        </div>
    )
}