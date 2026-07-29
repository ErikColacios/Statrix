"use client"
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import Link from "next/link";
import { GameStatus } from "@/enums/GameStatus";
import StarButton from "./StarButton";
import getUserVideogame from "@/actions/getUserVideogame";
import updateUserVideogame from "@/actions/updateUserVideogame";
import { useSession } from "next-auth/react";

type Props = {
    game: any
};

export default function AddGameModal({ game }: Props) {

    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [userGameInfo, setUserGameInfo] = useState<any>([])
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)
    const [hoursPlayed, setHoursPlayed] = useState<string>("")
    const [score, setScore] = useState<string>("")

    useEffect(() => {
        if (userId === undefined) return;
        const fetchUserGame = async () => {
            setUserGameInfo(await getUserVideogame(game.id ? game.id : game.game_id))
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

    function handleScoreChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value !== "") {
            const valueScore = parseFloat(e.target.value);
            if (valueScore > 10) {
                setScore("10")
            } else if (valueScore < 0) {
                setScore("0")
            } else {
                setScore(valueScore.toString());
            }
        } else {
            setScore("0")
        }
    }

    function handleHoursPlayedChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value !== "") {
            const valueHoursPlayed = parseFloat(e.target.value);
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
        const gameId: number = game.id ? game.id : game.game_id;
        const imageId: string = game?.cover?.image_id ? game?.cover.image_id : game.game_image_id;

        if (gameId) {
            await updateUserVideogame(gameId, selectedStatus, Number(score), Number(hoursPlayed), starred, game.name, imageId);
        }
    }


    return (
        <div className="w-full h-full flex flex-col justify-center border border-gray-600 sm:p-10 text-white sm:rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-5 sm:right-10 top-15 sm:top-10 p-2 rounded-sm transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <div className="flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row sm:space-x-8">
                <Link href={`/gamePage/${game.id ? game.id : game.game_id}`} className='relative w-48 h-64 rounded-2xl overflow-hidden cursor-pointer transition hover:opacity-70'>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game?.cover?.image_id ? game?.cover.image_id : game.game_image_id}.png`} className='w-full h-full transition duration-300' width={80} height={80} alt='Game cover' />
                </Link>
                <div className="flex flex-col items-center sm:items-start mt-8 sm:mt-0">
                    <div className="flex space-x-4">
                        <Link href={`/gamePage/${game.id ? game.id : game.game_id}`} className="text-2xl md:text-3xl">{game?.name ? game?.name : game?.game_name}</Link>
                        {userId && <StarButton handleStarred={handleStarred} favourite={starred} gameId={game.id} />}
                    </div>

                    {!userId &&
                        <div className="text-gray-400 my-12">
                            <p className="mb-8">Log in to add this game to your library and track your progress!</p>
                            <Link href="/login" className="text-md sm:text-lg text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                                Start now
                            </Link>
                        </div>
                    }
                    {userId &&
                        <div>
                            <div className="flex space-x-4 mt-6">
                                <div className="flex flex-col">
                                    <label className="text-gray-400">Score</label>
                                    <input id={'score'} onChange={handleScoreChange} type="number" className='w-24 rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right'
                                        value={score} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-400">Hours played</label>
                                    <input type="number" id={'hoursPlayed'} onChange={handleHoursPlayedChange} className='w-24 rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right' min={0}
                                        value={hoursPlayed} />
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-2">
                                <div className="flex flex-col">
                                    <label className="text-gray-400 mt-2">Status</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                            </div>
                            <Dialog.Close className="w-full text-white px-6 py-2 mt-4 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                                onClick={handleSaveUserGame} >
                                Save
                            </Dialog.Close>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}