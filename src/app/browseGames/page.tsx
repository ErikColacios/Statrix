"use client"
import React from "react";
import { getCovers } from '@/actions/getCovers'
import { Game } from '@/types/Game'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import SkeletonBrowseGames from "../browseGames/skeleton";
import { Dialog } from "radix-ui";
import AddGameModal from "@/components/AddGameModal";

export default function BrowseGames() {

  const [gameItems, setGameItems] = useState<Game[]>([])
  const [gameList, setGameList] = useState<Game[]>([])
  const [gameClicked, setGameClicked] = useState<Game>()

  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)

  const [responseOffset, setResponseOffset] = useState<number>(0)
  const [responseLimit, setResponseLimit] = useState<number>(64)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)


  useEffect(() => {
    const fetchGames = async () => {
      try {
        // While we fetch the covers, we display the loading animation, then we remove it
        setIsLoading(true)
        const covers = await getCovers(gameNameSearch, genre, responseOffset, responseLimit)
        if (covers) {
          setGameItems(covers)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    fetchGames()
  }, [gameNameSearch, genre, responseLimit])



  /**
   * Gets the search videogame name input and sets the state gameNameSearch
   */
  function handleSearchGame() {
    const searchGame: HTMLInputElement = document.getElementById("searchGame") as HTMLInputElement
    const name: string = searchGame.value;
    setGameNameSearch(name)
  }

  /**
   * Changes the genre
   */
  function handleSetGenre(genreId: number) {
    setGenre(genreId)
    setGameNameSearch("")
  }

  function handlePagination(previousNext: string) {
    if (previousNext === "next") {
      setResponseOffset(responseLimit)
      setResponseLimit(responseLimit + 64)
    }
    if (previousNext === "previous") {
      setResponseOffset(responseOffset - 64)
      setResponseLimit(responseOffset)
    }
  }


  return (
    <section className='flex w-full h-screen bg-black text-white text-sm py-20'>
      <Dialog.Root>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content onCloseAutoFocus={(e) => {e.preventDefault()}} className={`fixed flex justify-center p-2 left-1/2 w-full md:w-4/5 lg:w-3/5 2xl:w-3/6 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
            <Dialog.Title className="DialogTitle"></Dialog.Title>
            <Dialog.Description className="DialogDescription"></Dialog.Description>
            <AddGameModal game={gameClicked}/>
          </Dialog.Content>
        </Dialog.Portal>
        {/* Sidebar */}
        <aside className='hidden sm:flex h-screen flex-col w-36 items-center'>
          <p className="text-gray-200">Categories</p>
          <span className="bg-gray-400 w-[80%] h-px mt-1"></span>
          <div className="flex flex-col mt-1 pb-4 text-gray-400">
            <button className={genre !== 0 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(0)}>Trending</button>
          </div>
          <p className="text-gray-200">Genres</p>
          <span className="bg-gray-400 w-[80%] h-px mt-1"></span>
          <div className="flex flex-col pt-1 text-gray-400 pb-4">
            <button className={genre !== 5 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(5)}>Shooter</button>
            <button className={genre !== 12 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(12)}>RPG</button>
            <button className={genre !== 4 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(4)}>Fighting</button>
            <button className={genre !== 10 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(10)}>Racing</button>
            <button className={genre !== 14 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(14)}>Sport</button>
            <button className={genre !== 13 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(13)}>Simulator</button>
          </div>
        </aside>


        <div className="flex flex-col w-full px-4 pb-24 md:px-8">
          {/* Search bar */}
          <form className='w-full md:w-96 mb-6 relative flex items-center border border-gray-400' action={formAction}>
            <input type="text" name="searchGame" id="searchGame" className='w-full bg-transparent outline-none pl-2' placeholder='Hollow Knight' />
            <button className='rounded p-1 ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
          </form>

          {/* Games shown */}
          {isLoading ? <SkeletonBrowseGames /> :
            <div className='grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-8'>
              {gameItems.map((game, index: number) => (
                <div key={index} className={`${gameList.includes(game) ? 'border border-4 border-green-500 shadow-[inset_4px_0px_100px_50px_#19ff6e]' : ''} group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer lg:w-48 lg:h-64 transition hover:scale-110`} >
                  <Dialog.Trigger onClick={()=> setGameClicked(game)} >
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Game cover' />
                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                      <p>{game.name}</p>
                    </div>

                    <div className={gameList.includes(game) ? 'absolute bottom-0 right-0' : 'hidden'}>
                      <svg fill="#00ff4c" width="45px" height="45px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#00ff4c"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z"></path></g></svg>
                    </div>
                  </Dialog.Trigger>
                </div>
              ))}
            </div>}
          {gameItems.length !== 0 &&
            <div className="w-full flex justify-center text-gray-400 space-x-2 py-6">
              <button className="rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                disabled={responseOffset === 0}
                onClick={() => handlePagination('previous')}>Prev</button>
              <button className="rounded border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                onClick={() => handlePagination('next')}>Next</button>
            </div>
          }
          {gameItems.length === 0 &&
            <div className="w-full flex justify-center text-gray-400">
              No games found with the current filters...
            </div>
          }
        </div>
      </Dialog.Root>
    </section>
  )
}