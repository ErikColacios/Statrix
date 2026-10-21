"use client"
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { GameStatus } from "@/enums/GameStatus";
import StarButton from "./StarButton";
import getUserVideogame from "@/actions/getUserVideogame";
import updateUserVideogame from "@/actions/updateUserVideogame";
import { useSession } from "next-auth/react";
import AddToListModal from "./AddToListModal";
import { Game } from "@/types/Game";
import { GameIGDB } from "@/types/GameIGDB";
import { UserGame } from "@/types/UserGame";

type Props = {
    game: GameIGDB | Game | undefined;
    timerRef: React.MutableRefObject<number>;
    setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<React.SetStateAction<string>>;
};

export default function AddGameModal({ game, timerRef, setOpenToast, setToastMessage }: Props) {
    const years: number[] = []
    let currentYear = new Date().getFullYear()

    const session: any = useSession()
    const userId: string = session?.data?.user?.id as string
    const [userGameInfo, setUserGameInfo] = useState<UserGame>()
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)
    const [hoursPlayed, setHoursPlayed] = useState<number | undefined>()
    const [yearCompleted, setYearCompleted] = useState<string>("-")
    const [score, setScore] = useState<number>(0)
    const [scoreColor, setScoreColor] = useState<string>("NS")
    const [showDropdownYear, setShowDropdownYear] = useState<boolean>(false)
    const [nextSlide, setNextSlide] = useState<number>(0)

    const dropdownRef = useRef<HTMLDivElement>(null)

    function isGameIGDB(game: Game | GameIGDB): game is GameIGDB {
        return "id" in game && "name" in game
    }
    //if(isGameIGDB(game)){
    //console.log("Es de IGDB", game.cover.image_id)
    //}else {
    //console.log(game)
    //}

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && (!dropdownRef.current.contains(e.target as Node))) {
            setShowDropdownYear(false)
        }
    }

    for (let i = currentYear; i >= 1975; i--) {
        years.push(i)
    }

    useEffect(() => {
        if (game === undefined || userId === undefined) return;
        const fetchUserGame = async () => {
            if (isGameIGDB(game)) {
                const userGame: UserGame = await getUserVideogame(game.id)
                setUserGameInfo(userGame)
            } else {
                const userGame: UserGame = await getUserVideogame(game.game_id)
                setUserGameInfo(userGame)
            }
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
        if (userGameInfo !== undefined) {

            if (Number(userGameInfo?.score) === 0) {
                setScoreColor("NS")
            } else if (userGameInfo?.score >= 8) {
                setScoreColor("green")
            } else if (userGameInfo?.score >= 4) {
                setScoreColor("yellow")
            } else {
                setScoreColor("red")
            }

            setScore(userGameInfo?.score)
            setSelectedStatus(userGameInfo?.status)
            setStarred(userGameInfo?.favourite)
            setHoursPlayed(userGameInfo?.hours_played)
            setYearCompleted(userGameInfo?.year_completed)
        }
    }, [userGameInfo])


    // Passed to StarButton
    function handleStarred() {
        setStarred(!starred)
    }

    async function handleScoreChange(e: React.ChangeEvent<HTMLInputElement>) {
        const valueScore = parseFloat(e.target.value)
        setScore(valueScore)

        if (valueScore === 0) {
            setScoreColor("NS")
        } else if (valueScore >= 8) {
            setScoreColor("green")
        } else if (valueScore >= 4) {
            setScoreColor("yellow")
        } else {
            setScoreColor("red")
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
            await updateUserVideogame(userGameUpdated);
            setToastMessage("Game info updated successfully")
            setOpenToast(false)
            window.clearTimeout(timerRef.current)
            timerRef.current = window.setTimeout(() => { setOpenToast(true) }, 100)
        }
    }

    if (game === undefined) return;
    if (nextSlide === 1) return (<AddToListModal game_id={isGameIGDB(game) ? game.id : game.game_id} game_name={isGameIGDB(game) ? game.name : game.game_name} game_base_image={isGameIGDB(game) ? game.cover.image_id : game.game_image_id} setNextSlide={setNextSlide} />)

    const gameId: number = isGameIGDB(game) ? game.id : game.game_id
    const gameName: string = isGameIGDB(game) ? game.name : game.game_name
    const coverSrc: string = isGameIGDB(game) ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png` : game.game_base_image

    // Visual accents depending on the score color
    const scoreStyles: Record<string, { text: string, border: string, tint: string }> = {
        green: { text: "text-green-400", border: "border-green-500/60", tint: "from-green-600/30" },
        yellow: { text: "text-yellow-400", border: "border-yellow-500/60", tint: "from-yellow-600/25" },
        red: { text: "text-rose-400", border: "border-rose-500/60", tint: "from-rose-700/30" },
        NS: { text: "text-zinc-400", border: "border-white/15", tint: "from-zinc-700/20" },
    }
    const accent = scoreStyles[scoreColor] ?? scoreStyles.NS

    const statusOptions = [
        { status: GameStatus.PLAYING, icon: "/staticImages/icon_controller.png", alt: "Controller icon", iconClass: "w-4", activeClass: "from-teal-500 to-blue-500" },
        { status: GameStatus.COMPLETED, icon: "/staticImages/icon_confirmation.png", alt: "Confirmation icon", iconClass: "w-3", activeClass: "from-green-500 to-lime-500" },
        { status: GameStatus.ON_HOLD, icon: "/staticImages/icon_clock.png", alt: "Clock icon", iconClass: "w-4 h-4", activeClass: "from-indigo-600 to-blue-500" },
        { status: GameStatus.DROPPED, icon: "/staticImages/icon_skull.png", alt: "Skull icon", iconClass: "w-4 h-4", activeClass: "from-red-600 to-orange-700" },
    ]

    const labelClass = "text-xs font-medium uppercase tracking-wider text-zinc-400"

    if (nextSlide === 0)
        return (
            <div id="modal" className={`relative w-full h-full flex flex-col justify-center sm:border sm:rounded-2xl bg-zinc-950 text-white shadow-2xl transition-colors duration-500 ${accent.border}`}>

                {/* Blurred cover backdrop tinted by the score */}
                <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                    <img src={coverSrc} alt="Game cover" className="w-full h-full object-cover scale-125 blur-3xl opacity-25" />
                    <div className={`absolute inset-0 bg-linear-to-br ${accent.tint} via-zinc-950/80 to-zinc-950/95 transition-colors duration-500`} />
                </div>

                <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </Dialog.Close>

                <div className="relative flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8">
                    <aside className="flex flex-col items-center shrink-0 gap-3">
                        <Link href={`/gamePage/${gameId}`} className="group relative w-32 sm:w-44 aspect-3/4 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <img src={coverSrc} className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-80" width={80} height={80} alt="Game cover" />
                        </Link>
                        {userId &&
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                                <StarButton handleStarred={handleStarred} favourite={starred} gameId={gameId} />
                                <p>Mark as favourite</p>
                            </div>
                        }
                    </aside>

                    <div className="flex flex-col items-center sm:items-start w-full min-w-0">
                        <Link href={`/gamePage/${gameId}`} className="text-2xl md:text-3xl font-bold leading-tight sm:pr-10 transition hover:text-zinc-300">{gameName}</Link>

                        {!userId &&
                            <div className="text-zinc-400 my-10">
                                <p className="mb-8">Log in to add this game to your library and track your progress!</p>
                                <Link href="/login" className="text-md sm:text-lg font-semibold text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                                    Start now
                                </Link>
                            </div>
                        }
                        {userId &&
                            <div className="flex flex-col w-full gap-5 mt-5">
                                {/* Score */}
                                <div className="flex flex-col gap-2">
                                    <p className={labelClass}>Score</p>
                                    <div className="relative flex items-center justify-center sm:justify-start gap-3 group">
                                        <span id={'scoreText'}
                                            className={`flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-zinc-900/80 border-2 text-xl font-bold tabular-nums transition-colors duration-300 ${accent.border} ${accent.text}`}>
                                            {Number(score) === 0 ? "NS" : score}</span>
                                        {score === 0 && <p className="group-hover:hidden absolute left-16 sm:left-17 text-xs text-zinc-400 pointer-events-none">Drag to rate</p>}
                                        <input min="0" max="10" value={score ? score : 0} className="w-full max-w-72 sm:max-w-none rangeSlider" type="range" onChange={handleScoreChange}></input>
                                    </div>
                                </div>

                                {/* Hours played & year completed */}
                                <div className="grid grid-cols-2 gap-3 w-full text-left">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="hoursPlayed" className={labelClass}>Hours played</label>
                                        <input type="number" id={'hoursPlayed'} onChange={handleHoursPlayedChange} className="h-10 w-full rounded-lg px-3 bg-white/5 border border-white/10 outline-hidden transition focus:border-green-500 focus:bg-white/10 tabular-nums" min={0}
                                            value={hoursPlayed ? hoursPlayed : 0} />
                                    </div>
                                    <div className="relative flex flex-col gap-2">
                                        <p className={labelClass}>Year completed</p>
                                        <button onClick={() => setShowDropdownYear(!showDropdownYear)}
                                            className={`h-10 w-full flex items-center justify-between rounded-lg px-3 bg-white/5 border outline-hidden transition hover:bg-white/10 ${showDropdownYear ? "border-green-500" : "border-white/10"}`}>
                                            <span className="truncate">{yearCompleted}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-zinc-400 transition-transform ${showDropdownYear ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
                                        </button>

                                        {/* Dropdown of years */}
                                        {showDropdownYear &&
                                            <div ref={dropdownRef} className="absolute z-20 top-full mt-1 w-full max-h-44 p-1 overflow-y-auto no-scrollbar rounded-lg bg-zinc-900 border border-white/10 shadow-xl">
                                                <p className="cursor-pointer rounded-md px-3 py-1.5 transition hover:bg-white/10" onClick={() => handleYearCompletedChange("Don't remember")}>Don't remember</p>

                                                {years.map((year: number, index: number) => (
                                                    <p className={`cursor-pointer rounded-md px-3 py-1.5 transition hover:bg-white/10 ${yearCompleted === year.toString() ? "bg-white/10 text-green-400" : ""}`} key={index} onClick={() => handleYearCompletedChange(year.toString())}>{year}</p>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex flex-col gap-2 w-full text-left">
                                    <p className={labelClass}>Status</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                        {statusOptions.map((option) => (
                                            <button key={option.status}
                                                onClick={() => handleStatusChange(option.status)}
                                                className={`flex items-center justify-center h-10 px-2 rounded-lg border font-medium transition
                                                ${selectedStatus === option.status
                                                    ? `bg-linear-to-r ${option.activeClass} border-transparent shadow-lg`
                                                    : "bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"}`}>
                                                <img src={option.icon} alt={option.alt} className={`${option.iconClass} mr-2`} />
                                                {option.status}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-full flex gap-3 mt-2">
                                    <Dialog.Close className="flex items-center justify-center w-full h-11 px-2 sm:px-6 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300"
                                        onClick={handleSaveUserGame} >
                                        <img src="/staticImages/icon_confirmation.png" alt="Bookmark icon" className="w-3 h-3 mr-2" />
                                        Save
                                    </Dialog.Close>
                                    <button className="flex items-center justify-center w-full h-11 px-2 rounded-xl font-medium bg-white/5 border border-white/15 transition hover:bg-white/10"
                                        onClick={() => setNextSlide(1)} >
                                        <img src="/staticImages/icon_bookmark.png" alt="Bookmark icon" className="w-6 h-6 mr-1" />
                                        Add to list
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
}
