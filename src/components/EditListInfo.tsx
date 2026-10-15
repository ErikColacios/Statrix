'use client'
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { insertList } from '@/actions/insertList'
import { GameIGDB } from '@/types/GameIGDB'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import SortableItem from './SortableItem'
import { ListMode } from '@/enums/ListMode'

interface Props {
    setNextSlide: any
    gameList: GameIGDB[]
    setGameList: any
}

export default function EditListInfo({ setNextSlide, gameList, setGameList }: Props) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [selectedVisibility, setSelectedVisibility] = useState<string>("private")
    const [selectedMode, setSelectedMode] = useState<ListMode>(ListMode.UNRANKED)
    const [isFeatured, setIsFeatured] = useState<boolean>(false)

    async function createList() {
        const listNameElement: HTMLInputElement = document.getElementById('listName') as HTMLInputElement
        const listDescriptionElement: HTMLInputElement = document.getElementById('listDescription') as HTMLInputElement
        const listName: string = listNameElement.value
        const listDescription: string = listDescriptionElement.value

        if (listName === '') {
            setError('The list name cannot be empty')
        } else if (gameList.length === 0) {
            setError('You must add at least 1 game to create a list')
        } else {
            // If the list mode is ranked, we set the order rank of each game
            if(selectedMode === ListMode.RANKED) {
                gameList.map((game:GameIGDB, index:number)=> {
                    game.order = index
                })
            } else {
                gameList.map((game:GameIGDB)=> {
                    game.order = null
                })
            }

            await insertList(listName, listDescription, selectedVisibility, isFeatured, gameList, selectedMode)
            router.push('mylists')
        }
    }

    return (
        <div className="w-full flex justify-center animate-slide-left">
            <div className="w-full xl:w-1/2 flex flex-col p-4 pt-20 sm:p-20 min-h-screen text-white">
                <div className="flex flex-col sm:flex-row sm:items-center space-x-4 mt-4">
                    <h3 className="text-3xl">List information</h3>

                    {error && <p className="text-red-500">{error}</p>}
                    <div className="sm:ml-auto text-sm flex space-x-2 mt-4 sm:mt-0">
                        <button onClick={() => setNextSlide(0)}
                            className="px-4 py-1 rounded-sm text-gray-400 border border-gray-400 hover:text-white hover:bg-zinc-800 transition">
                            Back
                        </button>
                        <button onClick={createList}
                            className="px-4 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                            Save changes
                        </button>
                    </div>
                </div>
                <div className="flex flex-col mt-6">
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400">List name *</p>
                        <input type="text" name="listName" id="listName" className="rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600"/>
                    </div>

                    <p className="text-sm text-gray-400 mt-4">List description</p>
                    <textarea rows={5}
                        name="listDescription"
                        id="listDescription"
                        maxLength={250}
                        className="w-full rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-700 resize-none"/>

                    <p className='text-gray-400 mt-4'>Visibility</p>
                    <section className='flex flex-col sm:flex-row sm:space-x-2 space-y-3 sm:space-y-0 text-xl'>
                        <button onClick={() => setSelectedVisibility("public")}
                            className={`${selectedVisibility === "public" ? "bg-green-600/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center sm:w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                            <img src="/staticImages/icon_world.png" alt="Public icon" className='w-5 mb-1'/>
                            <p className="text-xl font-bold">Public</p>
                            <p className="text-sm text-gray-500 mt-1">Visible for anyone</p>
                        </button>
                        <button onClick={() => setSelectedVisibility("friends-only")}
                            className={`${selectedVisibility === "friends-only" ? "bg-green-600/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center sm:w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                            <img src="/staticImages/icon_friends.png" alt="Friends icon" className='w-5 mb-1'/>
                            <p className="text-xl font-bold">Friends only</p>
                            <p className="text-sm text-gray-500 mt-1">Only your friends can see it</p>
                        </button>
                        <button onClick={() => setSelectedVisibility("private")}
                            className={`${selectedVisibility === "private" ? "bg-green-600/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center sm:w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                            <img src="/staticImages/icon_locked.png" alt="Private icon" className='w-5 mb-1'/>
                            <p className="text-xl font-bold">Private</p>
                            <p className="text-sm text-gray-500 mt-1">Only you can access this list</p>
                        </button>
                    </section>

                    <p className='text-gray-400 mt-4'>Mode</p>
                    <section className='flex space-x-2 text-xl'>
                        <button onClick={() => setSelectedMode(ListMode.UNRANKED)} 
                            className={`${selectedMode === ListMode.UNRANKED ? "bg-green-500/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                            <img src="/staticImages/icon_unordered-list.png" alt="Cup icon" className='w-5 mb-1'/>
                            <p className="text-xl font-bold">Unranked</p>
                            <p className="text-sm text-gray-500 mt-1">Unordered list</p>
                        </button>
                        <button onClick={() => setSelectedMode(ListMode.RANKED)} 
                            className={`${selectedMode === ListMode.RANKED ? "bg-green-500/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                            <img src="/staticImages/icon_cup.png" alt="Cup icon" className='w-4 mb-1'/>
                            <p className="text-xl font-bold">Ranked</p>
                            <p className="text-sm text-gray-500 mt-1">Ranked list</p>
                        </button>
                    </section>

                    {/* Games */}
                    <section className={`mt-4 grid gap-4 grid-cols-3 sm:grid-cols-5`}>
                        <DragDropProvider onDragEnd={event => {
                                if (event.canceled) return;
                                const { source } = event.operation

                                if (isSortable(source)) {
                                    const { initialIndex, index } = source

                                    if (initialIndex !== index) {
                                        setGameList((game:any) => {
                                            const newItems = [...game]
                                            const [removed] = newItems.splice(initialIndex, 1)
                                            newItems.splice(index, 0, removed)
                                            return newItems
                                        })
                                    }
                                }
                            }}>
                            {/* List content */}
                            {gameList.map((game: GameIGDB, index: number) => (
                                <SortableItem key={game.id} id={game.id} index={index} imageId={game.cover.image_id} listMode={selectedMode}/>
                            ))}
                        </DragDropProvider>
                    </section>
                </div>
            </div>
        </div>
    )
}