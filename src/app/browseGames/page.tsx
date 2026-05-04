"use client"
import React from "react";
import { getCovers } from '@/actions/getCovers'
import { Videogame } from '@/types/Videogame'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'

export default function BrowseGames() {

  const router = useRouter()
  let [videogameItems, setVideogameItems] = useState<Videogame[]>([])
  const [gameList, setGameList] = useState<Videogame[]>([])
  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)


  // Custom alert
  const [alert, setAlert] = useState(<></>)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // While we fetch the covers, we display the loading animation, then we remove it
        setIsLoading(true)
        const covers = await getCovers(gameNameSearch, genre, 50)
        if (covers) {
          setVideogameItems(covers)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    fetchGames()
  }, [gameNameSearch, genre])



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
    setGenre(genreId);
    setGameNameSearch("")
  }


  return (
    <section className='flex pt-4'>
      {alert}
      {/* Sidebar */}
      <aside className='hidden sm:flex h-screen flex-col w-36 items-center pt-4 text-sm '>
        <p className="text-gray-200">Categories</p>
        <span className="bg-gray-400 w-[80%] h-px mt-1"></span>
        <div className="flex flex-col mt-1 pb-4 text-gray-400">
          <button className={genre !== 0 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(0)}>Trending</button>
        </div>
        <p className="text-gray-200">Genres</p>
        <span className="bg-gray-400 w-[80%] h-px mt-1"></span>
        <div className="flex flex-col pt-4 text-gray-400 pb-4">
          <button className={genre !== 5 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(5)}>Shooter</button>
          <button className={genre !== 12 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(12)}>RPG</button>
          <button className={genre !== 4 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(4)}>Fighting</button>
          <button className={genre !== 10 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(10)}>Racing</button>
          <button className={genre !== 14 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(14)}>Sport</button>
          <button className={genre !== 13 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={() => handleSetGenre(13)}>Simulator</button>
        </div>
      </aside>


      <div className="flex flex-col w-full px-4 pb-24 md:px-8">
        {/* List name*/}
        <div className='relative w-full flex flex-col md:flex-row md:items-center mb-8 text-2xl sm:text-3xl lg:text-4xl'>
          {/* Search bar */}
          <form className='absolute right-0 flex items-center text-sm border' action={formAction}>
            <input type="text" name="searchGame" id="searchGame" className='w-32 lg:w-full bg-transparent outline-none pl-2' placeholder='Hollow Knight' />
            <button className='p-1 rounded ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
          </form>
        </div>

        <div className='flex pt-4'>
          {/* Games shown */}
            <div className='grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-8'>
              {videogameItems.map((videogame, index: number) => (
                <div key={index} className={`${gameList.includes(videogame) ? 'border border-4 border-green-500 shadow-[inset_4px_0px_100px_50px_#19ff6e]' : ''} group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer lg:w-48 lg:h-64 transition hover:scale-110`}>
                  <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${videogame.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Videogame cover' />
                  <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                    <p className='text-sm md:text-lg'>{videogame.name}</p>
                  </div>

                  <div className={gameList.includes(videogame) ? 'absolute bottom-0 right-0' : 'hidden'}>
                    <svg fill="#00ff4c" width="45px" height="45px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#00ff4c"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z"></path></g></svg>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  )
}