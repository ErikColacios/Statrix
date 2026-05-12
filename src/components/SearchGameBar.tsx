"use client"
import React, { useEffect, useRef, useState } from "react"
import { getCovers } from "../actions/getCovers"
import { Game } from "../types/Game"

export default function SearchGameBar({ addNewGame }: any) {

    let [gameItems, setGameItems] = useState<Game[]>([])
    const [gameSearch, setGameSearch] = useState("")

    function handleSetGameNameSearch() {
        let gameSearchBar: HTMLInputElement = document.getElementById("gameSearchBar") as HTMLInputElement
        let gameListSearch: HTMLDivElement = document.getElementById("gameListSearch") as HTMLDivElement
        let loader: HTMLDivElement = document.getElementById("loader") as HTMLDivElement
        let name: string = gameSearchBar.value

        if (name === "") {
            gameListSearch.style.display = "none"
            loader.style.display = "none"
            setGameItems([])

        } else {
            gameListSearch.style.display = "block"
        }

        setGameSearch(name)

        // If the input name is equal or larger than 3, we fetch the videogames. We do this to prevent too many requests to the api
        if (name.length >= 3) {
            loader.style.display = "block"
            fetchVideogames()
        }
    }

    async function fetchVideogames() {
        let loader: HTMLDivElement = document.getElementById("loader") as HTMLDivElement

        try {
            const covers = await getCovers(gameSearch, 0, 0, 20)
            if (covers) {
                setGameItems(covers)
                loader.style.display = "none"
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
                    <div className="flex relative items-center mb-8">
                        <input className='w-full rounded-lg p-2 bg-gray-800 outline-none border border-gray-700 focus:border-green-600' type="text" name="gameSearchBar" id="gameSearchBar" placeholder="Baldur's gate 3" onChange={() => handleSetGameNameSearch()} />
                        <div className="loader-small absolute right-0 mr-3 hidden" id="loader"></div>
                    </div>
                    <div className="overflow-scroll no-scrollbar" id="gameListSearch" ref={ref}>
                        {gameItems.map((item: any, index: number) => (
                            <div className="flex items-center rounded-lg p-2 mb-1 cursor-pointer border border-gray-500 bg-zinc-900 hover:bg-zinc-800 hover:border-green-500" key={index} 
                            onClick={() => addNewGame(item)}>
                                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className='w-8 md:w-12 mr-4' alt='Game cover' />
                                <div className="flex flex-col">
                                    <p>{item.name}</p>
                                    <p className="">{item.release_dates ? item.release_dates[0].human : "Uknown"}</p>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
