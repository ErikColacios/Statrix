"use client"
import React, { useState, useEffect, useRef } from "react"
import { Game } from "@/types/Game"
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
            setPlayingGames(userGames.filter((game: Game) => game.status === GameStatus.PLAYING).length)
            setCompletedGames(userGames.filter((game: Game) => game.status === GameStatus.COMPLETED).length)
            setOnholdGames(userGames.filter((game: Game) => game.status === GameStatus.ON_HOLD).length)
            setDroppedGames(userGames.filter((game: Game) => game.status === GameStatus.DROPPED).length)
            setIsLoading(false)
        }

        fetchUserVideogames()
    }, [])


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

    function handleRemoveGame(gameId: number | undefined) {
        setGameListFiltered(gameListFiltered?.filter(game => game.game_id !== gameId))
        deleteUserVideogame(gameId)
    }

    // Fade up animation
    const fadeUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true, amount: 0.2 }
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
                        <div className="md:col-span-2 h-24 flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-5 sm:px-8 pt-26 pb-8"
                            onClick={() => { setViewGameStatus("All"), setGameListFiltered(gameList) }} >
                            <p className="text-3xl font-bold text-zinc-400">All the games</p>
                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-5 sm:px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.PLAYING), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.PLAYING)) }}>
                            <img src="/staticImages/icon_controller_gray.png" alt="Controller icon" className="bg-blue-500 bg-clip-text w-8 mr-2" />
                            <p className="text-3xl font-bold text-zinc-400">Playing</p>
                            <p className="ml-auto text-lg text-gray-400">{playingGames} games</p>
                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-5 sm:px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.COMPLETED), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.COMPLETED)) }}>
                            <div className="flex items-center">
                                <img src="/staticImages/icon_confirmation_gray.png" alt="Confirmation icon" className="w-5 mr-2" />
                                <p className="text-3xl font-bold text-zinc-400">Completed</p>
                            </div>
                            <p className="ml-auto text-lg text-gray-400">{completedGames} games</p>

                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-5 sm:px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.ON_HOLD), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.ON_HOLD)) }}>
                            <img src="/staticImages/icon_clock_gray.png" alt="Clock icon" className="w-8 h-8 mr-2" />
                            <p className="text-3xl font-bold text-zinc-400">On hold</p>
                            <p className="ml-auto text-lg text-gray-400">{onholdGames} games</p>
                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-5 sm:px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.DROPPED), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.DROPPED)) }}>
                            <img src="/staticImages/icon_skull_gray.png" alt="Skull icon" className="w-8 h-8 mr-2" />
                            <p className="text-3xl font-bold text-zinc-400">Dropped</p>
                            <p className="ml-auto text-lg text-gray-400">{droppedGames} games</p>
                        </div>
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
                                    <AddGameModal game={gameClicked} timerRef={timerRef} setOpenToast={setOpenToast} setToastMessage={setToastMessage}/>
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
                        <div className="mt-4 flex items-center justify-between gap-3">
                            {viewGameStatus === GameStatus.PLAYING && <p className="border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded p-1 px-3 py-1.5 text-lg font-semibold">{playingGames} game/s playing</p>}
                            {viewGameStatus === GameStatus.COMPLETED && <p className="border border-green-500/30 bg-green-500/10 text-green-400 rounded p-1 px-3 py-1.5 text-lg font-semibold" >{completedGames} game/s completed</p>}
                            {viewGameStatus === GameStatus.ON_HOLD && <p className="border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded p-1 px-3 py-1.5 text-lg font-semibold">{onholdGames} game/s on hold</p>}
                            {viewGameStatus === GameStatus.DROPPED && <p className="border border-rose-500/30 bg-rose-500/10 text-rose-400 rounded p-1 px-3 py-1.5 text-lg font-semibold">{completedGames} game/s dropped</p>}
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