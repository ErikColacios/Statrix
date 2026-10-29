"use client"
import React, { useState, useEffect, useRef } from "react"
import { Game } from "@/types/Game"
import { UserGame } from "@/types/UserGame"
import getUserVideogameAll from '@/actions/getUserVideogameAll'
import { Dialog, Toast } from "radix-ui"
import { useFormState } from "react-dom"
import AddGameModal from "@/components/AddGameModal"
import DeleteGameModal from "@/components/DeleteGameModal"
import { deleteUserVideogame } from "@/actions/deleteUserVideogame"
import { GameStatus } from "@/enums/GameStatus"
import { motion } from "framer-motion"
import SkeletonMyGames from "./skeleton"

export default function MyGames() {

    const [gameClicked, setGameClicked] = useState<Game>()
    const [modalType, setModalType] = useState<string>("")
    const [viewGameStatus, setViewGameStatus] = useState<GameStatus | "All">(GameStatus.NONE)
    const [gameList, setGameList] = useState<Game[]>()
    const [gameListFiltered, setGameListFiltered] = useState<Game[]>()
    const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [playingGames, setPlayingGames] = useState<number>(0)
    const [completedGames, setCompletedGames] = useState<number>(0)
    const [onholdGames, setOnholdGames] = useState<number>(0)
    const [droppedGames, setDroppedGames] = useState<number>(0)

    // Toast state
    const timerRef = useRef(0)
    const [openToast, setOpenToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    useEffect(() => {
        async function fetchUserVideogames() {
            setIsLoading(true)
            let userGames: any[] = await getUserVideogameAll()
            setGameList(userGames)
            setGameListFiltered(userGames)
            updateStatusCounters(userGames)
            setIsLoading(false)
        }

        fetchUserVideogames()
    }, [])

    function updateStatusCounters(games: Game[]) {
        setPlayingGames(games.filter((game: Game) => game.status === GameStatus.PLAYING).length)
        setCompletedGames(games.filter((game: Game) => game.status === GameStatus.COMPLETED).length)
        setOnholdGames(games.filter((game: Game) => game.status === GameStatus.ON_HOLD).length)
        setDroppedGames(games.filter((game: Game) => game.status === GameStatus.DROPPED).length)
    }

    // Reflects the changes saved in AddGameModal without fetching the games again
    function handleGameUpdated(userGame: UserGame) {
        const applyChanges = (game: Game): Game => game.game_id === userGame.game_id
            ? { ...game, score: userGame.score, hours_played: userGame.hours_played ?? 0, favourite: userGame.favourite, status: userGame.status ?? game.status, year_completed: userGame.year_completed }
            : game

        const updatedGames: Game[] = (gameList ?? []).map(applyChanges)
        setGameList(updatedGames)
        updateStatusCounters(updatedGames)

        // If a status filter is active, the game disappears from the view when its status changes
        setGameListFiltered(prev => (prev ?? []).map(applyChanges)
            .filter((game: Game) => viewGameStatus === "All" || viewGameStatus === GameStatus.NONE || game.status === viewGameStatus))
    }


    function handleSearchGame() {
        const searchGame = document.getElementById("searchGame") as HTMLInputElement
        const name = searchGame.value

        if (name === "") {
            setGameListFiltered(gameList)
            setGameList(gameList)
            setViewGameStatus(GameStatus.NONE)
            return
        }

        if (viewGameStatus === GameStatus.NONE) {
            setViewGameStatus("All")
        }

        const filteredGames = gameList?.filter((game: Game) =>
            game.game_name.toLowerCase().includes(name.toLowerCase())
        )
        setGameListFiltered(filteredGames)
    }

    // First removes the game from the ui, then updates the list in the server
    function handleRemoveGame(gameId: number | undefined) {
        const updatedGames: Game[] = (gameList ?? []).filter(game => game.game_id !== gameId)
        setGameList(updatedGames)
        setGameListFiltered(gameListFiltered?.filter(game => game.game_id !== gameId))
        updateStatusCounters(updatedGames)
        deleteUserVideogame(gameId)
    }

    // Fade up animation
    const fadeUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true, amount: 0.2 }
    }

    // Data for the status filter cards
    const totalGames: number = gameList?.length ?? 0
    const statusCards = [
        { status: GameStatus.PLAYING, count: playingGames, icon: "/staticImages/icon_controller.png", iconClass: "w-6", gradient: "from-teal-500 to-blue-500", glow: "bg-blue-500/20", hoverBorder: "hover:border-blue-500/60", dot: "bg-blue-500" },
        { status: GameStatus.COMPLETED, count: completedGames, icon: "/staticImages/icon_confirmation.png", iconClass: "w-4", gradient: "from-green-500 to-lime-500", glow: "bg-green-500/20", hoverBorder: "hover:border-green-500/60", dot: "bg-green-500" },
        { status: GameStatus.ON_HOLD, count: onholdGames, icon: "/staticImages/icon_clock.png", iconClass: "w-5 h-5", gradient: "from-indigo-600 to-blue-500", glow: "bg-indigo-500/20", hoverBorder: "hover:border-indigo-500/60", dot: "bg-indigo-500" },
        { status: GameStatus.DROPPED, count: droppedGames, icon: "/staticImages/icon_skull.png", iconClass: "w-5 h-5", gradient: "from-red-600 to-orange-700", glow: "bg-rose-500/20", hoverBorder: "hover:border-rose-500/60", dot: "bg-rose-500" },
    ]

    function getStatusCovers(status: GameStatus, amount: number): string[] {
        return (gameList ?? []).filter((game: Game) => game.status === status).slice(0, amount).map((game: Game) => game.game_base_image)
    }

    function getPercentage(count: number): number {
        return totalGames > 0 ? Math.round((count / totalGames) * 100) : 0
    }


    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20 pb-8'>
            <Toast.Provider>

            <div className="flex flex-col md:flex-row  border-gray-500 pb-3 mb-4">
                <div className="flex items-center space-x-4">
                    <h2 className='text-4xl font-bold md:text-5xl'>My games</h2>
                    <p className='text-gray-400 text-base md:ml-8 mt-1'>{gameList?.length} game/s</p>
                </div>
            <form className="relative ml-auto mt-4 flex w-full items-center rounded-xl border border-white/10 bg-zinc-900/70 transition-colors duration-200 focus-within:border-green-500/70 focus-within:ring-1 focus-within:ring-green-500/20 md:mt-0 md:w-96"
                action={formAction}>
                <input type="text"
                    name="searchGame"
                    id="searchGame"
                    className="w-full min-w-0 bg-transparent py-2 pl-3 pr-2 text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Search your games..."
                    aria-label="Search your games"/>
                <button className="mr-1.5 flex shrink-0 items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-500/10 hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    type="submit"
                    aria-label="Search">
                    <img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} />
                </button>
            </form>
            </div>
            <div className='flex flex-col space-y-4'>
                {isLoading ? <SkeletonMyGames /> : viewGameStatus === GameStatus.NONE &&
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* All the games */}
                        <button className="group md:col-span-2 relative isolate overflow-hidden text-left rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 transition duration-300 hover:border-white/25 hover:-translate-y-0.5"
                            onClick={() => { setViewGameStatus("All"), setGameListFiltered(gameList) }} >
                            {/* Covers mosaic */}
                            <div className="absolute inset-y-0 right-0 -z-20 w-full sm:w-2/3 grid grid-cols-4 sm:grid-cols-6 gap-1 opacity-40 transition duration-500 group-hover:opacity-60 group-hover:scale-105" aria-hidden="true">
                                {(gameList ?? []).slice(0, 12).map((game: Game, index: number) => (
                                    <img key={index} src={game.game_base_image} alt="" className="w-full h-full object-cover" />
                                ))}
                            </div>
                            <div className="absolute inset-0 -z-10 bg-linear-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40" />

                            <div className="flex items-start gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Library</p>
                                    <p className="text-3xl sm:text-4xl font-bold mt-1">All the games</p>
                                    <p className="text-zinc-400 mt-1">{totalGames} {totalGames === 1 ? "game" : "games"}</p>
                                </div>
                                <span className="ml-auto flex items-center justify-center w-11 h-11 rounded-full border border-white/15 bg-white/5 text-zinc-300 transition group-hover:bg-white group-hover:text-zinc-950">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </span>
                            </div>

                            {/* Status distribution */}
                            <div className="mt-8 max-w-xl">
                                <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                                    {statusCards.map((card) => (
                                        <div key={card.status} className={`h-full bg-linear-to-r ${card.gradient}`} style={{ width: `${getPercentage(card.count)}%` }} />
                                    ))}
                                </div>
                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-400">
                                    {statusCards.map((card) => (
                                        <div key={card.status} className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${card.dot}`} />
                                            {card.status} <span className="text-zinc-200 font-medium">{card.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </button>

                        {/* One card per game status */}
                        {statusCards.map((card) => {
                            const covers: string[] = getStatusCovers(card.status, 3)
                            const percentage: number = getPercentage(card.count)

                            return (
                                <button key={card.status}
                                    className={`group relative isolate overflow-hidden text-left rounded-3xl border border-white/10 bg-zinc-900/60 p-6 transition duration-300 hover:-translate-y-0.5 ${card.hoverBorder}`}
                                    onClick={() => { setViewGameStatus(card.status), setGameListFiltered(gameList?.filter((game: Game) => game.status === card.status)) }}>
                                    {/* Colored glow */}
                                    <div className={`absolute -top-16 -right-16 -z-10 w-56 h-56 rounded-full blur-3xl opacity-60 transition duration-500 group-hover:opacity-100 ${card.glow}`} aria-hidden="true" />

                                    <div className="flex items-start">
                                        <span className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br shadow-lg ${card.gradient}`}>
                                            <img src={card.icon} alt="" className={card.iconClass} />
                                        </span>

                                        {/* Fanned covers */}
                                        <div className="ml-auto flex pr-2 pt-1" aria-hidden="true">
                                            {covers.map((cover: string, index: number) => (
                                                <img key={index} src={cover} alt=""
                                                    className={`w-12 sm:w-14 aspect-3/4 object-cover rounded-lg ring-2 ring-zinc-900 shadow-xl -ml-5 first:ml-0 transition duration-300
                                                    ${index === 0 ? "-rotate-6 group-hover:-rotate-12 group-hover:-translate-x-1" : ""}
                                                    ${index === 1 ? "-translate-y-1 group-hover:-translate-y-2" : ""}
                                                    ${index === 2 ? "rotate-6 group-hover:rotate-12 group-hover:translate-x-1" : ""}`} />
                                            ))}
                                            {covers.length === 0 &&
                                                <div className="w-12 sm:w-14 aspect-3/4 rounded-lg border border-dashed border-white/20" />
                                            }
                                        </div>
                                    </div>

                                    <p className="text-2xl sm:text-3xl font-bold mt-6">{card.status}</p>
                                    <div className="mt-1 flex items-baseline gap-2 text-sm">
                                        <span className="text-zinc-200 font-medium">{card.count} {card.count === 1 ? "game" : "games"}</span>
                                        <span className="text-zinc-500">· {percentage}% of your library</span>
                                    </div>

                                    {/* Share of the library */}
                                    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                        <div className={`h-full rounded-full bg-linear-to-r transition-all duration-700 ${card.gradient}`} style={{ width: `${percentage}%` }} />
                                    </div>
                                </button>
                            )
                        })}
                    </section>
                }

                {viewGameStatus !== GameStatus.NONE &&
                    <Dialog.Root>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                            <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }}
                                className={`fixed w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-4/5 xl:w-3/5 2xl:w-3/7 rounded-lg shadow-xl
                                    data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                                <Dialog.Title className="DialogTitle"></Dialog.Title>
                                <Dialog.Description className="DialogDescription"></Dialog.Description>
                                {modalType === "editGame" && (
                                    <AddGameModal game={gameClicked} timerRef={timerRef} setOpenToast={setOpenToast} setToastMessage={setToastMessage} onSave={handleGameUpdated}/>
                                )}
                                {modalType === "removeGame" && (
                                    <DeleteGameModal gameId={gameClicked?.game_id} gameName={gameClicked?.game_name} gameBaseImage={gameClicked?.game_base_image} handleRemoveGame={handleRemoveGame} />
                                )}
                            </Dialog.Content>
                        </Dialog.Portal>
                        <button className="group flex items-center text-green-500 text-md hover:text-green-600 border border-green-600 w-20 rounded-sm mb-6" onClick={() => setViewGameStatus(GameStatus.NONE)}>
                            <svg className="w-6 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
                            Back
                        </button>

                        {/* Game status labels */}
                        <div className="flex items-center justify-between gap-3">
                            {viewGameStatus === GameStatus.PLAYING && <p className="bg-blue-500/10 text-blue-400 rounded p-1 px-3 py-1.5 text-lg font-semibold">{playingGames} game/s playing</p>}
                            {viewGameStatus === GameStatus.COMPLETED && <p className="bg-green-500/10 text-green-400 rounded p-1 px-3 py-1.5 text-lg font-semibold" >{completedGames} game/s completed</p>}
                            {viewGameStatus === GameStatus.ON_HOLD && <p className="bg-purple-500/10 text-purple-400 rounded p-1 px-3 py-1.5 text-lg font-semibold">{onholdGames} game/s on hold</p>}
                            {viewGameStatus === GameStatus.DROPPED && <p className="bg-rose-500/10 text-rose-400 rounded p-1 px-3 py-1.5 text-lg font-semibold">{droppedGames} game/s dropped</p>}
                        </div>
                        {gameListFiltered?.map((game: Game, index: number) => (
                            <div key={index}
                                className="group relative isolate overflow-hidden rounded-xl border border-gray-700 bg-zinc-900 transition-all duration-300 hover:border-green-500">
                                {/* Blurred background cover */}
                                <div className="absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-xl transition-transform duration-500 group-hover:scale-125"
                                    style={{ backgroundImage: `url("${game.game_base_image}")` }}/>

                                {/* Dark overlay */}
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950/95 via-zinc-950/85 to-zinc-950/65 transition-colors duration-300 group-hover:from-zinc-950/90 group-hover:via-zinc-950/75 group-hover:to-zinc-950/55" />

                                {/* Game content */}
                                <Dialog.Trigger
                                    onClick={() => { setGameClicked(game), setModalType("editGame")}}
                                    className="relative flex min-h-28 w-full items-center text-left">
                                    {/* Cover thumbnail */}
                                    <img src={game.game_base_image}
                                        alt={`${game.game_name} cover`}
                                        className={`h-full min-h-28 self-stretch border-r border-white/10 object-cover w-16 sm:w-24`}/>

                                    {/* Information */}
                                    <div className="min-w-0 flex-1 py-3 pl-3 pr-8 sm:pl-5 sm:pr-10">
                                        <div className="flex min-w-0 items-center gap-2">

                                            {/* Game name */}
                                            <p className="truncate text-left text-lg font-semibold text-white sm:text-xl">
                                                {game.game_name}
                                            </p>

                                            {/* Favourite */}
                                            <div className="ml-auto shrink-0">
                                                {game.favourite ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" stroke="#22c55e" strokeWidth="1.5" aria-label="Favourite">
                                                        <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" aria-label="Not a favourite">
                                                        <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* Score and playtime */}
                                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Score</span>
                                                <span className={`font-bold ${
                                                    game.score >= 8
                                                        ? 'text-green-400'
                                                        : game.score >= 4
                                                            ? 'text-yellow-400'
                                                            : game.score > 0
                                                                ? 'text-rose-400'
                                                                : 'text-gray-400'
                                                }`}>
                                                    {Number(game.score) === 0 ? 'NS' : game.score}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Playtime</span>
                                                <span className="font-medium text-white">
                                                    {game.hours_played} h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Trigger>

                                {/* Remove game */}
                                <Dialog.Trigger onClick={() => { setGameClicked(game); setModalType("removeGame"); }}
                                    aria-label={`Remove ${game.game_name}`}
                                    className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-black/40 opacity-100 transition hover:border-red-400 hover:bg-red-500/20 xl:opacity-0 xl:group-hover:opacity-100">
                                    <svg width="10" height="12" viewBox="0 0 21 21" fill="none" stroke="white" strokeWidth="2"><path d="M4 4l13 13M17 4L4 17" /></svg>
                                </Dialog.Trigger>
                            </div>
                        ))}
                        {gameListFiltered?.length === 0 && (
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-gray-400 rounded-2xl overflow-hidden md:text-lg border border-gray-500 bg-zinc-900">
                                <div>
                                    ˚‧º·(˃̣̣̥⌓˂̣̣̥)‧º·˚
                                </div>
                                <p className="text-base mt-4">No games found with this filter</p>
                            </div>
                        )}
                    </Dialog.Root>
                }
            </div>
            
                <Toast.Root className={`z-99 fixed animate-slide-left flex flex-col bottom-15 right-5 sm:right-15 text-white
                    rounded shadow-green-500/30 border-green-600 p-2 cardReviewGreen`} open={openToast} onOpenChange={setOpenToast}>
                    <Toast.Description>
                        <div className="flex items-center space-x-2">
                            <img src="/staticImages/icon_tick_circle.png" alt="Success icon" className="w-5 h-5" />
                            <p>{toastMessage}</p>
                        </div>
                    </Toast.Description>
                    <Toast.Close />
                </Toast.Root>
            <Toast.Viewport />
            </Toast.Provider>
        </div>
    )
}