"use client"
import React, { useEffect, useRef, useState } from "react";
import { GameStatus } from "@/enums/GameStatus";
import StarButton from "./StarButton";
import getUserVideogame from "@/actions/getUserVideogame";
import updateUserVideogame from "@/actions/updateUserVideogame";
import { Game } from "@/types/Game";
import { GameIGDB } from "@/types/GameIGDB";
import { UserGame } from "@/types/UserGame";
import { useSession } from "next-auth/react";

type Props = {
    game: GameIGDB | Game | undefined
};

export default function AddGame({ game }: Props) {

    const session: any = useSession()
    const userId: string = session?.data?.user?.id as string
    const [userGameInfo, setUserGameInfo] = useState<UserGame>()
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)
    const [hoursPlayed, setHoursPlayed] = useState<number | undefined>(undefined)
    const [yearCompleted, setYearCompleted] = useState<string>("-")
    const [score, setScore] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [scoreColor, setScoreColor] = useState<string>("none")
    const [showDropdownYear, setShowDropdownYear] = useState<boolean>(false)

    const dropdownRef = useRef<HTMLDivElement>(null)

    function isGameIGDB(game: Game | GameIGDB): game is GameIGDB {
        return "id" in game && "name" in game
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
            setShowDropdownYear(false)
        }
    };

    const years: number[] = []
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= 1975; i--) {
        years.push(i)
    }

    useEffect(() => {
        if (game === undefined) return;
        const fetchUserGame = async () => {
            if (isGameIGDB(game)) {
                const userGame: UserGame = await getUserVideogame(game.id)
                console.log(userGame)
                setUserGameInfo(userGame)
            } else {
                const userGame: UserGame = await getUserVideogame(game.game_id)
                console.log(userGame)
                setUserGameInfo(userGame)
            }
        }
        fetchUserGame()
    }, [])

    useEffect(() => {
        if (userGameInfo !== undefined) {
            setScore(userGameInfo?.score)
            setSelectedStatus(userGameInfo?.status)
            setStarred(userGameInfo?.favourite)
            setHoursPlayed(userGameInfo?.hours_played)
            setYearCompleted(userGameInfo?.year_completed)

            if (userGameInfo?.score >= 8) {
                setScoreColor("green")
            } else if (userGameInfo?.score >= 4) {
                setScoreColor("yellow")
            } else if (userGameInfo?.score < 4) {
                setScoreColor("red")
            } else if (userGameInfo?.score == 0) {
                setScoreColor("none")
            }
        }
    }, [userGameInfo])

    useEffect(() => {
        if (dropdownRef) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [dropdownRef])

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
                setHoursPlayed(0)
            } else if (valueHoursPlayed > 100000) {
                setHoursPlayed(undefined)
            } else {
                setHoursPlayed(valueHoursPlayed);
            }
        } else {
            setHoursPlayed(0)
        }
    }

    function handleStatusChange(status: GameStatus) {
        setSelectedStatus(status)

        switch (status) {
            case GameStatus.PLAYING:
                break;
            case GameStatus.COMPLETED:
                break;
            case GameStatus.ON_HOLD:
                break;
            case GameStatus.DROPPED:
                break;
        }
    }

    function handleYearCompletedChange(selectedYear: string) {
        setYearCompleted(selectedYear)
        setShowDropdownYear(false)
    }


    async function handleSaveUserGame() {
        if (game === undefined) return;

        const gameId: number = isGameIGDB(game) ? game.id : game.game_id
        const gameName: string = isGameIGDB(game) ? game.name : game.game_name
        const imageId: string = isGameIGDB(game) ? game.cover.image_id : game.game_image_id

        const userGameUpdated: UserGame = {
            user_id: userId,
            game_id: gameId,
            game_name: gameName,
            game_image_id: imageId,
            game_base_image: `https://images.igdb.com/igdb/image/upload/t_720p/${imageId}.png`,
            favourite: starred,
            score: Number(score),
            hours_played: hoursPlayed,
            status: selectedStatus,
            year_completed: yearCompleted
        }

        if (gameId) {
            const res = await updateUserVideogame(userGameUpdated);
            if (res?.success) {
                setError(null)
                setSuccess(res?.message || "Game info updated successfully.")
            } else {
                setError(res?.message || "There was an error saving the game info.")
                setSuccess(null)
            }
        }
    }

    if (game === undefined) return;
    return (
        <div className="flex flex-col justify-center">
            <p className="text-right text-gray-200 mb-2">Your stats</p>
            <span className="w-full bg-zinc-600 h-px mb-2"></span>
            <div className="flex flex-col space-y-3">
                <div className="flex flex-col space-y-3">
                    <div className="flex flex-col">
                        <label className="text-gray-400">Score</label>
                        <div className={`flex items-center sm:justify-start space-x-2 relative group`}>
                            <span id={'scoreText'}
                                className={`flex hover:bg-zinc-800 transition cursor-pointer items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-gray-500 p-1 text-xl font-bold
                                            ${scoreColor === "green" ? " text-green-600" : ""}
                                            ${scoreColor === "yellow" ? " text-yellow-600" : ""}
                                            ${scoreColor === "red" ? " text-rose-600" : ""}
                                            ${scoreColor === "none" ? "" : ""}
                                            `}>{score}</span>
                            {score == 0 && <p className="group-hover:hidden absolute ml-28 sm:left-15 text-xs">Drag to rate</p>}

                            <input min="0" max="10" value={score} className="w-1/2 rangeSlider" type="range" onChange={handleScoreChange}></input>
                            {scoreColor === "green" && <p className="text-green-600 text-sm w-16">Excellent</p>}
                            {scoreColor === "yellow" && <p className="text-yellow-600 text-sm w-16">Good</p>}
                            {scoreColor === "red" && <p className="text-rose-600 text-sm w-16">Bad</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col sm:justify-center items-center justify-start sm:items-start">
                            <p className="text-gray-400">Hours played</p>
                            <input type="number" id={'hoursPlayed'} onChange={handleHoursPlayedChange} className='w-full rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right' min={0}
                                value={hoursPlayed ? hoursPlayed : 0} />
                        </div>
                        <div className="relative flex flex-col sm:justify-center items-center justify-start sm:items-start">
                            <p className="text-gray-400">Year completed</p>
                            <button name="years" id="years-select" onClick={() => setShowDropdownYear(!showDropdownYear)}
                                className='w-full rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600 text-right no-scrollbar'>
                                {yearCompleted}
                            </button>

                            {/* Dropdown of years */}
                            {showDropdownYear &&
                                <div ref={dropdownRef} className="w-full max-h-28 p-1 bg-gray-800 border border-gray-700 overflow-scroll no-scrollbar absolute top-0 mt-16 rounded">
                                    <p className="cursor-pointer hover:bg-gray-700" onClick={() => handleYearCompletedChange("Don't remember")}>Don't remember</p>

                                    {years.map((year: number, index: number) => (
                                        <p className="cursor-pointer hover:bg-gray-700" key={index} onClick={() => handleYearCompletedChange(year.toString())}>{year}</p>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-400 mt-2">Status</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <button
                            onClick={() => handleStatusChange(GameStatus.PLAYING)}
                            className={selectedStatus === GameStatus.PLAYING
                                ? "flex items-center justify-center bg-linear-to-r from-teal-500 to-blue-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "flex items-center justify-center rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>
                            <img src="/staticImages/icon_controller.png" alt="Controller icon" className="w-4 mr-2" />
                            {GameStatus.PLAYING}</button>

                        <button
                            onClick={() => handleStatusChange(GameStatus.COMPLETED)}
                            className={selectedStatus === GameStatus.COMPLETED
                                ? "flex items-center justify-center  bg-linear-to-r from-green-500 to-lime-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "flex items-center justify-center  rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>
                            <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3 mr-2" />
                            {GameStatus.COMPLETED}</button>
                        <button
                            onClick={() => handleStatusChange(GameStatus.ON_HOLD)}
                            className={selectedStatus === GameStatus.ON_HOLD
                                ? "flex items-center justify-center bg-linear-to-r from-indigo-600 to-blue-500 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "flex items-center justify-center rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>
                            <img src="/staticImages/icon_clock.png" alt="Clock icon" className="w-4 h-4 mr-2" />
                            {GameStatus.ON_HOLD}</button>

                        <button
                            onClick={() => handleStatusChange(GameStatus.DROPPED)}
                            className={selectedStatus === GameStatus.DROPPED
                                ? "flex items-center justify-center bg-linear-to-r from-red-600 to-orange-700 rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                : "flex items-center justify-center rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                            }>
                            <img src="/staticImages/icon_skull.png" alt="Skull icon" className="w-4 h-4 mr-2" />
                            {GameStatus.DROPPED}</button>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <label className="text-gray-400">Favourite</label>
                    <StarButton handleStarred={handleStarred} favourite={starred} gameId={isGameIGDB(game) ? game?.id : game?.game_id} />
                </div>

                <button className="px-6 py-2 text-center rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                    onClick={handleSaveUserGame} >
                    Save changes
                </button>
                <div className="text-center">
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                </div>
            </div>
        </div>
    )
}