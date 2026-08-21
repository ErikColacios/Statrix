"use server"
import Link from "next/link"
import React from "react"
import { Game } from "@/types/Game"

type Props = {
    favouriteGames: Game[]
}

export default async function FavouriteGames({ favouriteGames }: Props) {
    return (
        <div className="grid grid-cols-5 gap-2 lg:w-1/2 p-1">
            {favouriteGames.map((game: Game, index: number) => (
                <Link href={`/gamePage/${game.game_id}`} key={index} className='relative group w-16 md:w-28'>
                    <div className="flex justify-center items-center rounded-lg overflow-hidden hover:border-green-500" >
                        <img src={game.game_base_image} className='w-full h-full transition duration-300 group-hover:blur-xs group-hover:brightness-50' alt={'Game cover'} />
                        <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                            <p className="text-xs">{game.game_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-xs xl:hidden group-hover:flex absolute right-1 bottom-2 w-5 h-5 rounded-full border border-gray-400 transition hover:bg-zinc-900">
                        <svg width="8px" height="14px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
                    </div>
                </Link>
            ))
            }
        </div>
    )
}