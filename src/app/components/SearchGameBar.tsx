"use client"
import React, { useEffect, useRef, useState } from "react"
import { getCovers } from "../actions/getCovers"
import { Videogame } from "../types/Videogame"

export default function SearchGameBar({addNewGame}:any) {

    let [videogameItems, setVideogameItems] = useState<Videogame[]>([])
    const [gameSearch, setGameSearch] = useState("")

    function handleSetGameNameSearch() {
        let gameSearchBar:HTMLInputElement = document.getElementById("gameSearchBar") as HTMLInputElement
        let gameListSearch:HTMLDivElement = document.getElementById("gameListSearch") as HTMLDivElement
        let loader:HTMLDivElement = document.getElementById("loader") as HTMLDivElement
        let name:string = gameSearchBar.value

        if(name === ""){
            gameListSearch.style.display = "none"
            loader.style.display = "none"
            setVideogameItems([])
            
        }else {
            gameListSearch.style.display = "block"
        }

        setGameSearch(name)

        // If the input name is equal or larger than 3, we fetch the videogames. We do this to prevent too many requests to the api
        if(name.length >= 3 ){
            loader.style.display = "block"
            fetchVideogames()
        }
    }

    async function fetchVideogames() {
        let loader:HTMLDivElement = document.getElementById("loader") as HTMLDivElement

        try{
            const covers = await getCovers(gameSearch, 0, 20)
        if(covers){
            setVideogameItems(covers)
            loader.style.display = "none"
        }
        } catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClickOutside)

        return ()=> {
            window.removeEventListener("click", handleClickOutside)
        }
    }, [])
    

    const ref = useRef<any>(null);

    const handleClickOutside = (e:any) =>{
        let gameListSearch:HTMLDivElement = document.getElementById("gameListSearch") as HTMLDivElement

        if(!ref.current?.contains(e.target)){
            gameListSearch.style.display = "none"
        }
    }

    return(
        <div className="mb-4 ">
            <div className="flex items-center">
                <div className="w-full">
                <label htmlFor="gameSearchBar" className="text-base">Search games</label>
                    <div className="flex relative">
                        <div className="flex flex-col w-full">
                            <div className="flex relative items-center">
                                {/* SEARCH GAME BAR */}
                                <input className="w-full block bg-gray-600 p-2 rounded-e focus:outline-none mb-1" type="text" name="gameSearchBar" id="gameSearchBar" placeholder="Baldur's gate 3" onChange={()=>handleSetGameNameSearch()}/>
                                <div className="loader-small absolute right-0 mr-3 hidden" id="loader"></div>
                            </div>
                            <div className="z-10 w-full text-sm max-h-80 overflow-scroll no-scrollbar" id="gameListSearch" ref={ref}>
                                {videogameItems.map((item:any,index:number) => (
                                    <div className="flex items-center bg-green-500 w-full p-1 mb-1 cursor-pointer hover:bg-lime-300 hover:text-green-800" key={index} onClick={()=> addNewGame(item)}>
                                        <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className='w-8 md:w-8 mr-4' width={80} height={60} alt='Videogame cover' />
                                        <p>{item.name}</p>
                                    </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
