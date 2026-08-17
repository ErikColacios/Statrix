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
    const years: number[] = []
    let currentYear = new Date().getFullYear()

    const session: any = useSession()
    const userId: string = session?.data?.user?.id as string
    const [userGameInfo, setUserGameInfo] = useState<any>([])
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)
    const [hoursPlayed, setHoursPlayed] = useState<string>("")
    const [yearCompleted, setYearCompleted] = useState<string>("-")
    const [score, setScore] = useState<number>(0)
    const [scoreColor, setScoreColor] = useState<string>("none")
    const [showDropdownYear, setShowDropdownYear] = useState<boolean>(false)

    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
            setShowDropdownYear(false)
        }
    };

    for (let i = currentYear; i >= 1975; i--) {
        years.push(i)
    }


    useEffect(() => {
        if (userId === undefined) return;
        const fetchUserGame = async () => {
            setUserGameInfo(await getUserVideogame(game.id ? game.id : game.game_id))
        }
        fetchUserGame()
    }, [])

    useEffect(() => {
        if (dropdownRef) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [dropdownRef])



    useEffect(() => {
        if (userGameInfo.length > 0) {
            setScore(userGameInfo[0]?.score)
            setSelectedStatus(userGameInfo[0]?.status)
            setStarred(userGameInfo[0]?.favourite)
            setHoursPlayed(userGameInfo[0]?.hours_played)
            setYearCompleted(userGameInfo[0]?.year_completed ? userGameInfo[0]?.year_completed : "-")

            if (userGameInfo[0]?.score >= 8) {
                setScoreColor("green")
            } else if (userGameInfo[0]?.score >= 4) {
                setScoreColor("yellow")
            } else if (userGameInfo[0]?.score < 4) {
                setScoreColor("red")
            } else if (userGameInfo[0]?.score == 0) {
                setScoreColor("none")
            }
        }
    }, [userGameInfo])

    // Passed to StarButton
    function handleStarred() {
        setStarred(!starred)
    }

    async function handleScoreChange(e: React.ChangeEvent<HTMLInputElement>) {
        const valueScore = parseFloat(e.target.value)
        setScore(valueScore);

        if (valueScore >= 8) {
            setScoreColor("green")
        } else if (valueScore >= 4) {
            setScoreColor("yellow")
        } else if (valueScore < 4) {
            setScoreColor("red")
        } else if (valueScore === 0) {
            setScoreColor("none")
        }
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

    function handleYearCompletedChange(selectedYear: string) {
        setYearCompleted(selectedYear)
        setShowDropdownYear(false)
    }

    async function handleSaveUserGame() {
        const gameId: number = game.id ? game.id : game.game_id;
        const imageId: string = game?.cover?.image_id ? game?.cover.image_id : game.game_image_id;

        if (gameId) {
            await updateUserVideogame(gameId, selectedStatus, Number(score), Number(hoursPlayed), yearCompleted, starred, game.name, imageId);
        }
    }


    return (
        <div id="modal" className={`w-full h-full flex flex-col justify-center border border-gray-600 sm:p-8 text-white sm:rounded-2xl backdrop-blur-lg transition bg-black/50
            ${scoreColor === "red" ? " cardReviewRed border-rose-600" : ""}
            ${scoreColor === "yellow" ? " cardReviewYellow border-yellow-600" : ""}
            ${scoreColor === "green" ? " cardReviewGreen border-green-600" : ""}
            `}>
            <Dialog.Close className="absolute right-5 sm:right-10 top-15 sm:top-10 p-2 rounded-sm transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>

            <div className="flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row sm:space-x-8">
                <aside className="flex flex-col items-center justify-center">
                    <Link href={`/gamePage/${game.id ? game.id : game.game_id}`} className='relative w-32 sm:w-48 md:h-60 rounded-2xl overflow-hidden cursor-pointer transition hover:opacity-70'>
                        <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game?.cover?.image_id ? game?.cover.image_id : game.game_image_id}.png`} className='w-full h-full transition duration-300' width={80} height={80} alt='Game cover' />
                    </Link>
                    <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm mt-2"><p>Mark as favourite</p>{userId && <StarButton handleStarred={handleStarred} favourite={starred} gameId={game.id} />}</div>
                </aside>


                <div className="flex flex-col items-center sm:items-start mt-5 sm:mt-0">
                    <div className="flex space-x-4">
                        <Link href={`/gamePage/${game.id ? game.id : game.game_id}`} className="text-2xl md:text-3xl">{game?.name ? game?.name : game?.game_name}</Link>
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
                        <>
                            <div className="flex flex-col space-y-2 mt-2">
                                <div className="flex flex-col">
                                    <p className="hidden sm:flex text-gray-400">Score</p>
                                    <div className={`flex items-center justify-center sm:justify-start space-x-2 relative group`}>
                                        <span id={'scoreText'}
                                            className={`flex hover:bg-zinc-800 transition cursor-pointer items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-gray-500 p-1 text-xl font-bold
                                            ${scoreColor === "green" ? " text-green-600" : ""}
                                            ${scoreColor === "yellow" ? " text-yellow-600" : ""}
                                            ${scoreColor === "red" ? " text-rose-600" : ""}
                                            ${scoreColor === "none" ? "" : ""}
                                            `}>{score}</span>
                                        {score == 0 && <p className="group-hover:hidden absolute ml-8 sm:left-15 text-xs"> Drag to rate</p>}
                                        <input min="0" max="10" value={score} className="w-52 sm:w-72 rangeSlider" type="range" onChange={handleScoreChange}></input>

                                        {scoreColor === "green" && <p className="text-green-600 text-sm">Excellent</p>}
                                        {scoreColor === "yellow" && <p className="text-yellow-600 text-sm">Good</p>}
                                        {scoreColor === "red" && <p className="text-rose-600 text-sm">Bad</p>}
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex flex-col sm:justify-center items-center justify-start sm:items-start">
                                        <p className="text-gray-400">Hours played</p>
                                        <input type="number" id={'hoursPlayed'} onChange={handleHoursPlayedChange} className='w-28 rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right' min={0}
                                            value={hoursPlayed} />
                                    </div>
                                    <div className="relative flex flex-col sm:justify-center items-center justify-start sm:items-start">
                                        <p className="text-gray-400">Year completed</p>
                                        <button name="years" id="years-select" onClick={() => setShowDropdownYear(!showDropdownYear)}
                                            className='w-34 max-x-23 rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right no-scrollbar'>
                                            {yearCompleted}
                                        </button>

                                        {/* Dropdown of years */}
                                        {showDropdownYear &&
                                            <div ref={dropdownRef} className="max-h-24 w-34 p-1 bg-gray-800 border border-gray-700 overflow-scroll no-scrollbar absolute top-0 mt-16 rounded">
                                                <p className="cursor-pointer hover:bg-gray-700" onClick={() => handleYearCompletedChange("Don't remember")}>Don't remember</p>

                                                {years.map((year: number, index: number) => (
                                                    <p className="cursor-pointer hover:bg-gray-700" key={index} onClick={() => handleYearCompletedChange(year.toString())}>{year}</p>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="flex space-x-4 mt-2">
                                <div className="flex flex-col">
                                    <p className="text-gray-400 mt-2">Status</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                        <button
                                            onClick={() => setSelectedStatus(GameStatus.PLAYING)}
                                            className={selectedStatus === GameStatus.PLAYING
                                                ? "flex items-center justify-center bg-linear-to-r from-teal-500 to-blue-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                                : "flex items-center justify-center rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                            }>
                                            <img src="/staticImages/icon_controller.png" alt="Controller icon" className="w-4 mr-2" />
                                            {GameStatus.PLAYING}</button>

                                        <button
                                            onClick={() => setSelectedStatus(GameStatus.COMPLETED)}
                                            className={selectedStatus === GameStatus.COMPLETED
                                                ? "flex items-center justify-center  bg-linear-to-r from-green-500 to-lime-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                                : "flex items-center justify-center  rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                            }>
                                            <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3 mr-2" />
                                            {GameStatus.COMPLETED}</button>
                                        <button
                                            onClick={() => setSelectedStatus(GameStatus.ON_HOLD)}
                                            className={selectedStatus === GameStatus.ON_HOLD
                                                ? "flex items-center justify-center bg-linear-to-r from-indigo-600 to-blue-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                                : "flex items-center justify-center rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                            }>
                                            <img src="/staticImages/icon_clock.png" alt="Clock icon" className="w-4 h-4 mr-2" />
                                            {GameStatus.ON_HOLD}</button>

                                        <button
                                            onClick={() => setSelectedStatus(GameStatus.DROPPED)}
                                            className={selectedStatus === GameStatus.DROPPED
                                                ? "flex items-center justify-center bg-linear-to-r from-red-600 to-orange-700 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                                : "flex items-center justify-center rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                            }>
                                            <img src="/staticImages/icon_skull.png" alt="Skull icon" className="w-4 h-4 mr-2" />
                                            {GameStatus.DROPPED}</button>
                                    </div>
                                </div>
                            </div>
                            <Dialog.Close className="w-4/5 sm:w-full text-white px-6 py-2 mt-4 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                                onClick={handleSaveUserGame} >
                                Save changes
                            </Dialog.Close>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}