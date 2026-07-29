'use client'
import React from 'react';
import updateList from '@/actions/updateList';
import SearchGameBar from '@/components/SearchGameBar';
import { Game } from '@/types/Game';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dialog } from 'radix-ui';


export default function SearchGameModal({ listId }: { listId: string }) {

    let [gamesAdded, setGamesAdded] = useState<Game[]>([])

    function addNewGame(game: Game) {
        for (let i = 0; i < gamesAdded.length; i++) {
            if (gamesAdded[i].name === game.name) {
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

    return (
        <div className="w-full h-full sm:h-160 md:h-180 overflow-hidden flex-col border border-gray-600 px-4 py-24 sm:py-14 md:px-10 text-white sm:rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-5 sm:right-10 top-15 p-2 sm:rounded-sm transition hover:bg-gray-800">
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <p className="text-3xl">Add more games</p>

            <div className="flex flex-col text-sm mt-8">
                <div className="flex flex-col">
                    {/* Search game */}
                    <SearchGameBar addNewGame={addNewGame} />

                    {/* Games added */}
                    <div className='flex items-center mb-2'>
                        <p className='text-gray-500'>Games added: {gamesAdded.length}</p>
                        <Dialog.Close onClick={() => saveChanges()} className="ml-auto px-4 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                            Save games
                        </Dialog.Close>
                    </div>

                    <div className="max-h-140 no-scrollbar overflow-y-auto grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8 gap-4 py-2">
                        {gamesAdded.map((game: any, index: number) => (
                            <div key={index} className="group w-24 relative flex justify-center items-center rounded-2xl border border-gray-600 overflow-hidden cursor-pointer transition hover:scale-110">
                                <img src={game.cover.image_id ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png` : ""}
                                className="w-full h-full transition duration-300 group-hover:blur-xs group-hover:brightness-50"
                                alt="Game cover"/>
                                <div className="absolute text-center hidden transition ease-in-out group-hover:block">
                                    <p className="text-sm">{game.name}</p>
                                </div>
                                <button className="absolute bottom-1 right-1 p-1 rounded-sm transition hover:bg-red-800" onClick={(e) => removeAddedGame(game.id)}>
                                    <svg width="12px" height="12px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}