"use client"
import React, { useState, useEffect } from "react"
import { Game } from "@/types/Game"
import getUserVideogameAll from '@/actions/getUserVideogameAll'
import { Dialog } from "radix-ui"
import { useFormState } from "react-dom"
import AddGameModal from "@/components/AddGameModal"
import DeleteGameModal from "@/components/DeleteGameModal"
import { deleteUserVideogame } from "@/actions/deleteUserVideogame"
import { GameStatus } from "@/enums/GameStatus"

export default function MyGames() {

    const [gameClicked, setGameClicked] = useState<Game>()
    const [modalType, setModalType] = useState<string>("")
    const [viewGameStatus, setViewGameStatus] = useState<GameStatus>(GameStatus.NONE)
    const [gameList, setGameList] = useState<Game[]>()
    const [gameListFiltered, setGameListFiltered] = useState<Game[]>()
    const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)
    const [playedGames, setPlayedGames] = useState<number>(0)
    const [completedGames, setCompletedGames] = useState<number>(0)
    const [onholdGames, setOnholdGames] = useState<number>(0)
    const [droppedGames, setDroppedGames] = useState<number>(0)

    useEffect(() => {
        async function fetchUserVideogames() {
            let userGames: any[] = await getUserVideogameAll()
            setGameList(userGames)
            setGameListFiltered(userGames)
            setPlayedGames(userGames.filter((game: Game) => game.status === GameStatus.PLAYING).length)
            setCompletedGames(userGames.filter((game: Game) => game.status === GameStatus.COMPLETED).length)
            setOnholdGames(userGames.filter((game: Game) => game.status === GameStatus.ON_HOLD).length)
            setDroppedGames(userGames.filter((game: Game) => game.status === GameStatus.DROPPED).length)
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

        const filteredGames = gameList?.filter((game: Game) =>
            game.game_name.toLowerCase().includes(name.toLowerCase())
        )
        setGameListFiltered(filteredGames)
    }

    function handleRemoveGame(gameId: number | undefined) {
        setGameListFiltered(gameListFiltered?.filter(game => game.game_id !== gameId))
        deleteUserVideogame(gameId)
    }


    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>
            <div className="flex flex-col md:flex-row  border-gray-500 pb-3 mb-4">
                <div className="flex items-center space-x-4">
                    <h2 className='text-2xl md:text-3xl'>My games</h2>
                    <p className='text-gray-400 text-base md:ml-8 mt-1'>{gameList?.length} game/s</p>
                </div>
                <form className='ml-auto w-full md:w-96 mt-4 md:mt-0 relative flex items-center border border-gray-400 rounded-md' action={formAction}>
                    <input type="text" name="searchGame" id="searchGame" className='w-full bg-transparent outline-hidden pl-2' placeholder='Half Life 2' />
                    <button className='rounded-sm p-1 ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
                </form>
            </div>
            <div className='flex flex-col space-y-4'>
                {viewGameStatus === GameStatus.NONE &&
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.PLAYING), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.PLAYING)) }}>
                            <p className="text-3xl md:text-4xl font-bold text-zinc-400">Playing</p>
                            <p className="ml-auto text-lg text-gray-400">{playedGames} games</p>
                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.COMPLETED), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.COMPLETED)) }}>
                            <p className="text-3xl md:text-4xl font-bold text-zinc-400">Completed</p>
                            <p className="ml-auto text-lg text-gray-400">{completedGames} games</p>
                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.ON_HOLD), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.ON_HOLD)) }}>
                            <p className="text-3xl md:text-4xl font-bold text-zinc-400">On hold</p>
                            <p className="ml-auto text-lg text-gray-400">{onholdGames} games</p>
                        </div>
                        <div className="flex items-end bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl px-8 pt-26 pb-8" onClick={() => { setViewGameStatus(GameStatus.DROPPED), setGameListFiltered(gameList?.filter((game: Game) => game.status === GameStatus.DROPPED)) }}>
                            <p className="text-3xl md:text-4xl font-bold text-zinc-400">Dropped</p>
                            <p className="ml-auto text-lg text-gray-400">{droppedGames} games</p>
                        </div>
                    </section>
                }

                {viewGameStatus !== GameStatus.NONE &&
                    <Dialog.Root>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                            <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }}
                                className={`fixed w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-4/5 lg:w-3/5 2xl:w-3/7  rounded-lg shadow-xl
                                    data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                                <Dialog.Title className="DialogTitle"></Dialog.Title>
                                <Dialog.Description className="DialogDescription"></Dialog.Description>
                                {modalType === "editGame" && (
                                    <AddGameModal game={gameClicked} />
                                )}
                                {modalType === "removeGame" && (
                                    <DeleteGameModal gameId={gameClicked?.game_id} gameName={gameClicked?.game_name} gameBaseImage={gameClicked?.game_base_image} handleRemoveGame={handleRemoveGame} />
                                )}
                            </Dialog.Content>
                        </Dialog.Portal>
                        <button className="group flex items-center text-green-500 text-md hover:text-green-600 border border-green-600 w-20 rounded-sm" onClick={() => setViewGameStatus(GameStatus.NONE)}>
                            <svg className="w-6 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
                            Back
                        </button>
                        <p className={`text-3xl font-bold
                            ${viewGameStatus === GameStatus.PLAYING ? 'text-blue-600' : 
                            viewGameStatus === GameStatus.COMPLETED ? 'text-green-500' :
                            viewGameStatus === GameStatus.ON_HOLD ? 'text-purple-500' : 'text-rose-600'}`}>{viewGameStatus}</p>
                        {gameListFiltered?.map((game: Game, index: number) => (
                            <div className="group relative rounded-sm rounded-lg overflow-hidden md:text-lg border border-gray-500 bg-zinc-900 hover:bg-zinc-800 hover:border-green-500" key={index}>

                                <Dialog.Trigger onClick={() => { setGameClicked(game), setModalType("editGame") }} className='flex items-center w-full'>
                                    <img src={game.game_base_image} className="w-20 sm:w-24 border-r border-gray-500" alt={'Game cover'} />
                                    <div className='flex flex-col ml-3 sm:ml-10'>
                                        <div className='flex'>
                                            <p className="text-left text-lg sm:text-xl mr-4">{game.game_name}</p>
                                            <div className='flex items-center sm:flex-row  mr-4 md:mr-12'>
                                                <div>
                                                    <svg className={game.favourite ? "hidden" : ""} width="20px" height="28px" viewBox="0 0 33.00 33.00" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#fcfcfc" strokeWidth="0.132"><title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" strokeWidth="0.858" fill="none" fillRule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill=""> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g><g id="SVGRepo_iconCarrier"> <title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" fill="none" fillRule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill=""> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g></svg>
                                                    <svg className={game.favourite ? "" : "hidden"} width="20px" height="28px" viewBox="0 -0.5 33 33" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#000000" strokeWidth="0.132"></g><g id="SVGRepo_iconCarrier"> <title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill="#ffffff"> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex space-x-4 text-sm mt-4'>
                                            <div className='flex text-gray-400 items-center'>
                                                <label className="mr-2">Score</label>
                                                <p className={`font-bold
                                            ${game.score >= 8 ? " text-green-600" : ""}
                                            ${game.score >= 4 && game.score < 8 ? " text-yellow-600" : ""}
                                            ${game.score < 4 ? " text-rose-600" : ""}
                                            `}>{game.score}</p>
                                            </div>
                                            <div className='flex items-center text-sm'>
                                                <div className='flex text-gray-400 items-center'>
                                                    <label className="mr-2">Playtime</label>
                                                    <p className='text-white'>{game.hours_played} h</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Trigger>
                                <Dialog.Trigger onClick={() => { setGameClicked(game), setModalType("removeGame") }} className="flex items-center justify-center text-xs xl:hidden group-hover:flex absolute right-2 bottom-2 w-5 h-5 rounded-full border border-gray-400 transition hover:bg-zinc-900">
                                    <svg width="8px" height="14px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
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
        </div>
    )
}