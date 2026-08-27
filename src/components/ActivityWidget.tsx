"use server"
import Link from "next/link"
import React from "react"
import { Game } from "@/types/Game"

type Props = {
    favouriteGames: Game[]
}

export default async function ActivityWidget({ favouriteGames }: Props) {
    return (
        <div className="grid grid-cols-5 gap-2 px-1">
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
        </div>
    )
}