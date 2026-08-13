"use client"
import { Game } from "@/types/Game"
import { Dialog } from "radix-ui"
import React, { useState } from "react"
import AddGameModal from "./AddGameModal"
import { useFormState } from "react-dom"

type Props = {
    userGames: Game[]
}

export default function UserVideogame({ userGames }: Props) {

    const [gameClicked, setGameClicked] = useState<Game>()
    const [modalType, setModalType] = useState<string>("")
    const [gameList, setGameList] = useState<Game[]>(userGames)
    const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)


    function handleSearchGame() {
        const searchGame: HTMLInputElement = document.getElementById("searchGame") as HTMLInputElement
        const name: string = searchGame.value

        gameList.filter((game: Game) => {
            if (game.game_name.toLowerCase().includes(name.toLowerCase())) {
                setGameList([game])
            }
        })

        if (name === "") {
            setGameList(userGames)
        }
    }

    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>
            <div className="flex items-center  border-b-2 border-gray-500 pb-3 mb-8">
                <h2 className='text-2xl md:text-3xl'>My games</h2>
                <p className='text-gray-400 text-base ml-8 mt-1'>{userGames.length} game/s</p>
                <form className='ml-auto w-full md:w-96 relative flex items-center border border-gray-400 rounded-md' action={formAction}>
                    <input type="text" name="searchGame" id="searchGame" className='w-full bg-transparent outline-hidden pl-2' placeholder='Half Life 2' />
                    <button className='rounded-sm p-1 ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
                </form>
            </div>
            <div className='flex flex-col space-y-4'>
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
                        </Dialog.Content>
                    </Dialog.Portal>
                    {gameList.map((game: Game, index: number) => (
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
                        </div>
                    ))
                    }
                </Dialog.Root>
            </div>
        </div>
    )
}