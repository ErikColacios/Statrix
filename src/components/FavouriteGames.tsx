"use server"
import React from "react"
import { Game } from "@/types/Game"
import Link from "next/link"

type Props = {
    favouriteGames: Game[],
    canEdit: boolean
}

const MAX_FAVOURITES = 5

export default async function FavouriteGames({ favouriteGames, canEdit }: Props) {
    // Empty slots up to 5, so the row always has the same size
    const emptySlots = Array.from({ length: Math.max(0, MAX_FAVOURITES - favouriteGames.length) }, (_, i) => favouriteGames.length + i + 1)

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

                {emptySlots.map((position) => {
                    const slotContent = (
                        <>
                            <span className="absolute top-1 left-2 text-xs font-bold text-white/20">#{position}</span>
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className={`w-6 h-6 md:w-8 md:h-8 opacity-40 transition duration-300 ${canEdit ? "group-hover:opacity-100 group-hover:scale-110" : ""}`} />
                            {canEdit
                                ? <span className="hidden md:block mt-2 text-xs text-green-400 opacity-0 transition duration-300 group-hover:opacity-100">+ Add</span>
                                : position === 1 && favouriteGames.length === 0 && <span className="hidden md:block mt-2 px-1 text-center text-xs text-gray-500">No favourites yet</span>}
                        </>
                    )
                    const slotClassName = "relative group w-16 md:w-28 aspect-[3/4] flex flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-zinc-900/40 backdrop-blur-lg transition duration-300"

                    return canEdit
                        ? <Link href="/mygames" key={position} className={`${slotClassName} hover:border-green-500 hover:bg-green-900/20`} title="Add a favourite game">{slotContent}</Link>
                        : <div key={position} className={slotClassName}>{slotContent}</div>
                })}
            </section>

            {canEdit && favouriteGames.length === 0 && (
                <p className="mt-2 px-1 text-xs text-gray-500">Mark games as favourite with the star when editing them in <Link href="/mygames" className="text-green-500 hover:text-green-600">My Games</Link>.</p>
            )}
        </>
    )
}
