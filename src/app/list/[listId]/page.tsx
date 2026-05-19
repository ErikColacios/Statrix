"use client"
import React, { useState, useEffect } from 'react';
import { Game } from '@/types/Game';
import { Dialog } from "radix-ui";
import { getListContent } from '@/actions/getListContent';
import AddGameModal from '@/components/AddGameModal';
import SearchGameModal from '@/components/SearchGameModal';
import EditListInfoModal from '@/components/EditListInfoModal';
import DeleteListModal from '@/components/DeleteListModal';

export default function List({ params }: { params: { listId: string } }) {

    let listId = params.listId;
    const [listContent, setListContent] = useState<Game[]>([])
    const [gameClicked, setGameClicked] = useState<Game>()
    const [modalType, setModalType] = useState<string>("")

    useEffect(() => {
        const getListContentData = async () => {
            const content = await getListContent(listId)
            setListContent(content)
        }
        getListContentData()
    }, [])


    return (
        <>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className={`fixed p-2 w-full md:w-4/5 lg:w-3/5 2xl:w-3/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                                    data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {modalType === "editGame" && (
                            <AddGameModal game={gameClicked} />
                        )}
                        {modalType === "addGame" && (
                            <SearchGameModal listId={listId} />
                        )}
                        {modalType === "editListInfo" && (
                            <EditListInfoModal listId={listId} />
                        )}
                        {modalType === "deleteList" && (
                            <DeleteListModal list_id={listId} />
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
                
                <div className='w-full flex text-sm'>
                    <div className='ml-auto'>
                        <Dialog.Trigger onClick={() => {setModalType("addGame")}} className="px-2 py-1 rounded bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                            + Add more games
                        </Dialog.Trigger>

                        <Dialog.Trigger onClick={() => {setModalType("editListInfo")}} className="ml-4 px-2 py-1  rounded text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                            Edit list info
                        </Dialog.Trigger>

                        <Dialog.Trigger onClick={() => {setModalType("deleteList")}} className="ml-4 px-2 py-1  rounded text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                            Delete list
                        </Dialog.Trigger>
                    </div>

                </div>


                <div className="grid lg:grid-cols-2 gap-4 mt-3">
                    {/* List content */}
                    {listContent.map((game: Game, index: number) => (
                        <Dialog.Trigger onClick={() => {setGameClicked(game), setModalType("editGame")}} className="relative flex items-center rounded rounded-lg overflow-hidden md:text-lg border border-gray-500 bg-zinc-900 hover:bg-zinc-800 hover:border-green-500" key={index}>
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
                                        <p className='text-white'>{game.score}</p>
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
                    ))}
                </div>
            </Dialog.Root>
        </>
    )
}