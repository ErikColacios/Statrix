'use client'
import React from 'react';
import updateList from '@/actions/updateList';
import SearchGameBar from '@/components/SearchGameBar';
import { Game } from '@/types/Game';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { GameIGDB } from '@/types/GameIGDB';


export default function SearchGameModal({ listId }: { listId: string }) {

    let [gamesAdded, setGamesAdded] = useState<GameIGDB[]>([])

    async function addNewGame(game: GameIGDB) {
        for (let i = 0; i < gamesAdded.length; i++) {
            if (gamesAdded[i].name === game.name) {
                console.log(gamesAdded[i].name, game.name)
                return;
            }
        }
        setGamesAdded([...gamesAdded, game])
    }

    async function removeAddedGame(gameId: number) {
        setGamesAdded(gamesAdded.filter(item => item.id !== gameId))
    }

    async function saveChanges() {
        updateList(listId, gamesAdded)
    }

    const labelClass = "text-xs font-medium uppercase tracking-wider text-zinc-400"

    return (
        <div className="relative w-full h-full sm:h-160 md:h-180 flex flex-col sm:border border-white/15 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl">

            {/* Subtle green glow backdrop */}
            <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-zinc-950/60" />
            </div>

            <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Dialog.Close>

            <div className="relative flex flex-col flex-1 min-h-0 px-4 pt-24 pb-6 sm:p-8 md:px-10">
                <div className="sm:pr-10">
                    <p className="text-2xl md:text-3xl font-bold leading-tight">Add more games</p>
                    <p className="text-sm text-zinc-400 mt-1">Search games and add them to this list.</p>
                </div>

                <div className="flex flex-col flex-1 min-h-0 text-sm mt-6">
                    {/* Search game */}
                    <SearchGameBar addNewGame={addNewGame} />

                    {/* Games added */}
                    <div className="flex items-center gap-2 pt-4 mb-3 border-t border-white/10">
                        <p className={labelClass}>Games added</p>
                        <span className={`min-w-6 h-6 px-2 flex items-center justify-center rounded-full text-xs font-semibold transition
                            ${gamesAdded.length > 0 ? "bg-green-500/20 text-green-400" : "bg-white/5 text-zinc-400"}`}>
                            {gamesAdded.length}
                        </span>
                        <Dialog.Close onClick={() => saveChanges()} className="ml-auto flex items-center h-10 px-5 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                            <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3 mr-2" />
                            Save games
                        </Dialog.Close>
                    </div>

                    {gamesAdded.length === 0 &&
                        <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/5 py-8 px-4 text-center">
                            <p className="text-zinc-300">No games added yet</p>
                            <p className="text-xs text-zinc-500">The games you pick will appear here before saving.</p>
                        </div>
                    }

                    <div className="flex-1 min-h-0 no-scrollbar overflow-y-auto grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7 content-start gap-3 sm:gap-4 py-2">
                        {gamesAdded.map((game: GameIGDB, index: number) => (
                            <div key={index} className="group relative aspect-3/4 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-lg animate-element-appear">
                                <img src={game.cover.image_id ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png` : ""}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-50"
                                alt="Game cover"/>
                                <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/90 to-transparent opacity-0 transition group-hover:opacity-100">
                                    <p className="text-xs font-medium leading-tight line-clamp-2">{game.name}</p>
                                </div>
                                <button aria-label="Remove game" className="absolute top-1.5 right-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-white transition hover:bg-rose-600" onClick={(e) => removeAddedGame(game.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
