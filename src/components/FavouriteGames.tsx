"use server"
import Link from "next/link"
import React from "react"
import { Game } from "@/types/Game"

type Props = {
    favouriteGames: Game[]
}

export default async function FavouriteGames({ favouriteGames }: Props) {
    return (
        <>
            <section className="grid grid-cols-5 gap-2 px-1">
                {favouriteGames.map((game: Game, index: number) => (
                    <Link href={`/gamePage/${game.game_id}`} key={index} className='relative group w-16 md:w-28'>
                        <div className="flex justify-center items-center rounded-lg overflow-hidden hover:border-green-500" >
                            <img src={game.game_base_image} className='w-full h-full transition duration-300 group-hover:blur-xs group-hover:brightness-50' alt={'Game cover'} />
                            <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                <p className="text-xs">{game.game_name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
            {favouriteGames.length === 0 && (
                <section className="grid grid-cols-5 gap-2 px-1">
                    <Link href={`/browseGames`} className='w-full h-26 md:h-36 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-gray-600 rounded-lg text-white text-sm sm:text-base'>
                        <div className="flex flex-col text-center text-gray-400">
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-8 h-8" />
                        </div>
                    </Link>
                    <Link href={`/browseGames`}  className='w-full h-26 md:h-36 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-gray-600 rounded-lg text-white text-sm sm:text-base'>
                        <div className="flex flex-col text-center text-gray-400">
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-8 h-8" />
                        </div>
                    </Link>
                    <Link href={`/browseGames`}  className='w-full h-26 md:h-36 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-gray-600 rounded-lg text-white text-sm sm:text-base'>
                        <div className="flex flex-col text-center text-gray-400">
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-8 h-8" />
                        </div>
                    </Link>
                    <Link href={`/browseGames`}  className='w-full h-26 md:h-36 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-gray-600 rounded-lg text-white text-sm sm:text-base'>
                        <div className="flex flex-col text-center text-gray-400">
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-8 h-8" />
                        </div>
                    </Link>
                    <Link href={`/browseGames`}  className='w-full h-26 md:h-36 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-gray-600 rounded-lg text-white text-sm sm:text-base'>
                        <div className="flex flex-col text-center text-gray-400">
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-8 h-8" />
                        </div>
                    </Link>
                </section>
            )}
        </>
    )
}