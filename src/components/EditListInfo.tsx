'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { insertList } from '@/actions/insertList'
import { GameIGDB } from '@/types/GameIGDB'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import SortableItem from './SortableItem'
import ListInfoFields from './ListInfoFields'
import { ListMode } from '@/enums/ListMode'

interface Props {
    setNextSlide: any
    gameList: GameIGDB[]
    setGameList: any
    // Name and description come from the newList page, so they are kept when going back to the first step
    listName: string
    setListName: (name: string) => void
    listDescription: string
    setListDescription: (description: string) => void
}

// Second step of the new list page: name, visibility, mode and order of the games
export default function EditListInfo({ setNextSlide, gameList, setGameList, listName, setListName, listDescription, setListDescription }: Props) {
    const router = useRouter()
    const [nameError, setNameError] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [selectedVisibility, setSelectedVisibility] = useState<string>("private")
    const [selectedMode, setSelectedMode] = useState<ListMode>(ListMode.UNRANKED)
    const [isFeatured, setIsFeatured] = useState<boolean>(false)

    async function createList() {
        if (listName.trim() === '') {
            setNameError('The list name cannot be empty')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        if (gameList.length === 0) {
            setError('You must add at least 1 game to create a list')
            return
        }

        // If the list mode is ranked, we set the order rank of each game
        gameList.forEach((game: GameIGDB, index: number) => {
            game.order = selectedMode === ListMode.RANKED ? index : null
        })

        setIsSaving(true)
        await insertList(listName.trim(), listDescription, selectedVisibility, isFeatured, gameList, selectedMode)
        router.push('/mylists')
    }

    return (
        <section className="relative isolate w-full min-h-screen bg-void text-snow text-sm animate-slide-left">
            {/* Background glows, same as the first step */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
                <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(34,197,94,0.16),transparent_72%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(30%_40%_at_15%_20%,rgba(163,230,53,0.08),transparent_70%)]" />
            </div>

            <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-28 pb-40 md:pt-32">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <p className="text-sm font-semibold text-green-400">New list</p>
                    <h1 className="mt-4 text-display-md font-semibold text-balance headline-sheen">Name your list.</h1>
                    <p className="mt-4 max-w-[52ch] text-base text-smoke text-pretty">Give it a name, choose who can see it and, if it is ranked, the order of the games.</p>
                </div>

                <div className="mt-10 flex flex-col gap-6">
                    <ListInfoFields
                        listName={listName} setListName={(name) => { setListName(name); setNameError(null) }}
                        listDescription={listDescription} setListDescription={setListDescription}
                        isFeatured={isFeatured} setIsFeatured={setIsFeatured}
                        visibility={selectedVisibility} setVisibility={setSelectedVisibility}
                        mode={selectedMode} setMode={setSelectedMode}
                        nameError={nameError} />

                    {/* Games */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Games</p>
                            <span className="min-w-6 h-6 px-2 flex items-center justify-center rounded-full text-xs font-semibold bg-white/5 text-zinc-400">{gameList.length}</span>
                            {selectedMode === ListMode.RANKED && <p className="ml-auto text-xs text-zinc-500">Drag and drop to order the games</p>}
                        </div>

                        <section className="grid gap-3 sm:gap-4 grid-cols-3 sm:grid-cols-5">
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

                        {gameList.length === 0 &&
                            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-zinc-400">
                                <p className="font-medium text-white">No games yet</p>
                                <p>Go back and click on any cover to add it to your list.</p>
                            </div>}
                    </div>
                </div>
            </div>

            {/* Bottom bar, same as the first step */}
            <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
                <div className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/85 p-2 pl-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    <button onClick={() => setNextSlide(0)}
                        className="group flex h-11 shrink-0 items-center gap-1 rounded-xl px-3 text-zinc-300 transition hover:bg-white/5 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:-translate-x-0.5"><path d="m15 18-6-6 6-6" /></svg>
                        Back
                    </button>
                    <p className="min-w-0 flex-1 truncate text-xs text-rose-400">{error}</p>
                    <button onClick={createList} disabled={isSaving}
                        className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-green-500 to-lime-500 px-5 font-semibold text-white shadow-lg shadow-green-900/40 transition duration-300 hover:from-green-500 hover:to-lime-600 disabled:opacity-60">
                        <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3" />
                        {isSaving ? "Creating..." : "Create list"}
                    </button>
                </div>
            </div>
        </section>
    )
}
