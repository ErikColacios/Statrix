"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Game } from '@/types/Game';
import { Dialog, Toast } from "radix-ui";
import { getListContent } from '@/actions/getListContent';
import AddGameModal from '@/components/AddGameModal';
import SearchGameModal from '@/components/SearchGameModal';
import EditListInfoModal from '@/components/EditListInfoModal';
import DeleteListModal from '@/components/DeleteListModal';
import DeleteGameListModal from '@/components/DeleteGameListModal';
import { deleteGameList } from '@/actions/deleteGameList';
import { motion } from "framer-motion"
import { ViewMode } from '@/enums/ViewMode';

export default function List({ params }: { params: { listId: string } }) {

    let listId = params.listId;
    const [listContent, setListContent] = useState<Game[]>([])
    const [gameClicked, setGameClicked] = useState<Game>()
    const [modalType, setModalType] = useState<string>("")
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID)
    const [isOwner, setIsOwner] = useState<boolean>(false)

    // Toast state
    const timerRef = useRef(0)
    const [openToast, setOpenToast] = useState(false)
    useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    useEffect(() => {
        const getListContentData = async () => {
            const content = await getListContent(listId)
            setListContent(content)
            setIsOwner(content[0]?.isowner)
        }
        getListContentData()
    }, [])

    function handleRemoveGame(listId: string, gameId: number | undefined) {
        setListContent(listContent.filter(game => game.game_id !== gameId))
        deleteGameList(listId, gameId)
    }

    // Fade up animation
    const fadeUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true, amount: 0.2 }
    }

    return (
        <>
        <Toast.Provider>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }}
                        className={isOwner ? `fixed w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-4/5 lg:w-3/5 2xl:w-3/7  rounded-lg shadow-xl
                                    data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]` : 'hidden'}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {modalType === "editGame" && isOwner && (
                            <AddGameModal game={gameClicked} timerRef={timerRef} setOpenToast={setOpenToast} />
                        )}
                        {modalType === "addGame" && isOwner && (
                            <SearchGameModal listId={listId} />
                        )}
                        {modalType === "editListInfo" && isOwner && (
                            <EditListInfoModal listId={listId} listContent={listContent} setListContent={setListContent}/>
                        )}
                        {modalType === "deleteList" && isOwner && (
                            <DeleteListModal listId={listId} />
                        )}
                        {modalType === "removeGame" && isOwner && (
                            <DeleteGameListModal listId={listId} gameId={gameClicked?.game_id} gameName={gameClicked?.game_name} gameBaseImage={gameClicked?.game_base_image} handleRemoveGame={handleRemoveGame} />
                        )}  
                    </Dialog.Content>
                </Dialog.Portal>

                <div className='w-full flex flex-col sm:flex-row text-sm mt-3'>
                    <div className='flex space-x-2 order-2 sm:order-1 mt-4 sm:mt-0'>
                        <button onClick={() => setViewMode(ViewMode.LIST)} className="px-1 py-1 rounded-sm text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                            <img src="/staticImages/icon_list.png" alt="List icon" className="w-5" />
                        </button>
                        <button onClick={() => setViewMode(ViewMode.GRID)} className="hidden lg:flex px-2 py-1 rounded-sm text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                            <img src="/staticImages/icon_grid.png" alt="Grid icon" className="w-4" />
                        </button>
                        <button onClick={() => setViewMode(ViewMode.COVERS)} className="px-2 py-1 rounded-sm text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                            <img src="/staticImages/icon_covers.png" alt="Covers icon" className="w-4" />
                        </button>
                    </div>
                    {isOwner &&
                        <div className='flex sm:flex-row space-x-2 sm:space-x-4 sm:ml-auto order-1 sm:order-2'>
                            <Dialog.Trigger onClick={() => { setModalType("addGame") }} className="px-2 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                                + Add games
                            </Dialog.Trigger>

                            <Dialog.Trigger onClick={() => { setModalType("editListInfo") }} className="flex items-center px-2 py-1 rounded-sm text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                                <img src="/staticImages/icon_edit.png" alt="Edit list icon" className="w-3 mr-1" />
                                Edit list
                            </Dialog.Trigger>

                            <Dialog.Trigger onClick={() => { setModalType("deleteList") }} className="flex items-center px-2 py-1 rounded-sm text-gray-400 border border-gray-400 transition hover:text-white hover:bg-zinc-800">
                                <img src="/staticImages/icon_trash.png" alt="Trash icon" className="w-4 mr-1" />
                                Delete
                            </Dialog.Trigger>
                        </div>
                    }
                </div>

                {(viewMode === ViewMode.LIST || viewMode === ViewMode.GRID) && (
                    <motion.section {...fadeUp} className={`mt-4 grid gap-4 ${viewMode === ViewMode.GRID ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                        {listContent.map((game: Game, index: number) => (
                            <div key={index}
                                className="group relative isolate overflow-hidden rounded-xl border border-gray-700 bg-zinc-900 transition-all duration-300 hover:border-green-500">
                                {/* Blurred background cover */}
                                <div
                                    className="absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-xl transition-transform duration-500 group-hover:scale-125"
                                    style={{ backgroundImage: `url("${game.game_base_image}")` }}/>

                                {/* Dark overlay */}
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950/95 via-zinc-950/85 to-zinc-950/65 transition-colors duration-300 group-hover:from-zinc-950/90 group-hover:via-zinc-950/75 group-hover:to-zinc-950/55" />

                                {/* Game content */}
                                <Dialog.Trigger
                                    onClick={() => { setGameClicked(game), setModalType("editGame")}}
                                    className="relative flex min-h-28 w-full items-center text-left"
                                    disabled={!isOwner}>
                                    {/* Cover thumbnail */}
                                    <img src={game.game_base_image}
                                        alt={`${game.game_name} cover`}
                                        className={`h-full min-h-28 self-stretch border-r border-white/10 object-cover ${viewMode === ViewMode.LIST ? 'w-16 sm:w-21' : 'w-16 sm:w-24'}`}/>

                                    {/* Information */}
                                    <div className="min-w-0 flex-1 py-3 pl-3 pr-8 sm:pl-5 sm:pr-10">
                                        <div className="flex min-w-0 items-center gap-2">
                                            {game.rank_order !== null && (
                                                <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md border border-white/15 bg-black/50 px-1.5 text-xs font-bold text-gray-200 shadow-lg backdrop-blur-sm">
                                                    {game.rank_order + 1}
                                                </span>
                                            )}

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
                                <Dialog.Trigger
                                    onClick={() => {setGameClicked(game); setModalType("removeGame")}}
                                    aria-label={`Remove ${game.game_name}`}
                                    className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-black/40 opacity-100 transition hover:border-red-400 hover:bg-red-500/20 xl:opacity-0 xl:group-hover:opacity-100">
                                    <svg width="10" height="12" viewBox="0 0 21 21" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M4 4l13 13M17 4L4 17" />
                                    </svg>
                                </Dialog.Trigger>
                            </div>
                        ))}
                    </motion.section>
                )}

                {listContent.length == 0 && <p className='text-gray-400'>This list is empty</p>}

                {viewMode === ViewMode.COVERS &&
                    <div className={`mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3`}>
                        {listContent.map((game: Game, index: number) => (
                            <div key={index} className='relative group'>
                                <Dialog.Trigger onClick={() => { setGameClicked(game), setModalType("editGame") }} className="relative flex justify-center items-center rounded-lg overflow-hidden hover:border-green-500" disabled={!isOwner} >
                                    <img src={game.game_base_image} className='w-full h-full transition duration-300 group-hover:blur-xs group-hover:brightness-50' alt={'Game cover'} />
                                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                        <p>{game.game_name}</p>
                                    </div>
                                    {game.rank_order !== null && <span className="absolute bottom-0 flex h-7 min-w-7 items-center justify-center rounded-md border border-green-500/30 bg-zinc-950/90 px-1.5 text-xs font-bold text-gray-200 shadow-lg">{game.rank_order+1}</span>}
                                </Dialog.Trigger>
                                {/* Remove game */}
                                <Dialog.Trigger
                                    onClick={() => {setGameClicked(game); setModalType("removeGame")}}
                                    aria-label={`Remove ${game.game_name}`}
                                    className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-black/40 opacity-100 transition hover:border-red-400 hover:bg-red-500/20 xl:opacity-0 xl:group-hover:opacity-100">
                                    <svg width="10" height="12" viewBox="0 0 21 21" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M4 4l13 13M17 4L4 17" />
                                    </svg>
                                </Dialog.Trigger>
                            </div>
                        ))}
                    </div>
                }
            </Dialog.Root>
            <Toast.Root className={`z-99 fixed animate-slide-left flex flex-col bottom-15 right-5 sm:right-15 text-white
              rounded shadow-green-500/30 border-green-600 p-2 cardReviewGreen`} open={openToast} onOpenChange={setOpenToast}>
                  <Toast.Description>
                      <div className="flex items-center space-x-2">
                          <img src="/staticImages/icon_tick_circle.png" alt="Success icon" className="w-5 h-5" />
                          <p>Game info updated successfully</p>
                      </div>
                  </Toast.Description>
                  <Toast.Close/>
              </Toast.Root>
              <Toast.Viewport/>
          </Toast.Provider>
        </>
    )
}