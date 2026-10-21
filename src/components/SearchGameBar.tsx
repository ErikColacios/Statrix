"use client"
import React, { FormEvent, useEffect, useRef, useState } from "react"
import { fetchGamesIGDB } from "../actions/fetchGamesIGDB"
import { GameIGDB } from "@/types/GameIGDB"

export default function SearchGameBar({ addNewGame }: any) {

    let [gameItems, setGameItems] = useState<GameIGDB[]>([])

    async function handleSetGameNameSearch(e:FormEvent) {
        e.preventDefault()
        let gameSearchBar: HTMLInputElement = document.getElementById("gameSearchBar") as HTMLInputElement
        let gameListSearch: HTMLDivElement = document.getElementById("gameListSearch") as HTMLDivElement
        let loader: HTMLDivElement = document.getElementById("loader") as HTMLDivElement
        let gameName: string = gameSearchBar.value

        if (gameName === "") {
            gameListSearch.style.display = "none"
            loader.style.display = "none"
            setGameItems([])

        } else {
            gameListSearch.style.display = "block"
        }

        // If the input name is equal or larger than 3, we fetch the videogames. We do this to prevent too many requests to the api
        if (gameName.length >= 3) {
            loader.style.display = "block"
            fetchVideogames(gameName)
        }
    }

    async function fetchVideogames(gameName: string) {
        let loader: HTMLDivElement = document.getElementById("loader") as HTMLDivElement

        try {
            const covers:GameIGDB[] = await fetchGamesIGDB(gameName, 0, 0, 20)
            if (covers) {
                setGameItems(covers)
                loader.style.display = "none"
                console.log(covers)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClickOutside)

        return () => {
            window.removeEventListener("click", handleClickOutside)
        }
    }, [])

    const ref = useRef<any>(null);

    const handleClickOutside = (e: any) => {
        let gameListSearch: HTMLDivElement = document.getElementById("gameListSearch") as HTMLDivElement

        if (!ref.current?.contains(e.target)) {
            gameListSearch.style.display = "none"
        }
    }

    return (
        <div className="w-full">
            <div className="flex relative">
                <div className="flex flex-col w-full text-sm">
                    <form className="flex relative items-center" onSubmit={handleSetGameNameSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 text-zinc-400 pointer-events-none"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input className="w-full h-11 rounded-xl pl-10 pr-24 bg-white/5 border border-white/10 outline-hidden placeholder:text-zinc-500 transition focus:border-green-500 focus:bg-white/10" type="text" name="gameSearchBar" id="gameSearchBar" placeholder="Baldur's gate 3"/>
                        <div className="loader-small absolute right-24 hidden" id="loader"></div>
                        <button className="absolute right-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300" type="submit">Search</button>
                    </form>
                    <p className="text-xs text-zinc-500 mt-2 mb-3">Type at least 3 characters and press Enter. Click a game to add it.</p>

                    {/* The display of this container is toggled from the search and click outside handlers */}
                    <div className="max-h-72 sm:max-h-80 overflow-auto no-scrollbar mb-4 rounded-xl" id="gameListSearch" ref={ref}>
                        <div className="flex flex-col gap-1">
                            {gameItems.map((item: any, index: number) => (
                                <div className="group flex items-center gap-3 rounded-xl p-2 cursor-pointer border border-white/10 bg-white/5 transition hover:bg-white/10 hover:border-green-500/60" key={index}
                                onClick={() => addNewGame(item)}>
                                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className="w-9 md:w-11 aspect-3/4 object-cover rounded-md ring-1 ring-white/10" alt="Game cover" />
                                    <div className="flex flex-col min-w-0">
                                        <p className="font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-zinc-400">{item.release_dates ? item.release_dates[0].human : "Unknown"}</p>
                                    </div>
                                    <span className="ml-auto shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-zinc-400 border border-white/10 transition group-hover:text-white group-hover:border-transparent group-hover:bg-linear-to-r group-hover:from-green-500 group-hover:to-lime-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                    </span>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
