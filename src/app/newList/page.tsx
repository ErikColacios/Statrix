"use client"
import React from "react";
import { getCovers } from '@/actions/getCovers'
import { insertList } from '@/actions/insertList'
import CustomModal from '@/components/CustomModal'
import { Game } from '@/types/Game'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import SkeletonBrowseGames from "../browseGames/skeleton";
import EditListInfo from "@/components/EditListInfo";

export default function NewList() {

  const [gameItems, setGameItems] = useState<Game[]>([])
  const [gameList, setGameList] = useState<Game[]>([])
  const [listName, setListName] = useState<string>("")
  const [countGames, setCountGames] = useState(0)
  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)
  const sidebarRef = useRef<HTMLDivElement>(null);

  // States for the modals and alerts
  const [showModal, setShowModal] = useState(false)
  const [modalTrigger, setModalTrigger] = useState(0)

  // Custom alert
  const [alert, setAlert] = useState(<></>)

  const [responseOffset, setResponseOffset] = useState<number>(0)
  const [responseLimit, setResponseLimit] = useState<number>(21)

  const [nextSlide, setNextSlide] = useState<number>(0)


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
        setIsLoading(false)
      }
    }
    fetchGames()
  }, [gameNameSearch, genre, responseLimit])


  /**
   * Controls if the game exists in the list, and if it don't, then adds it
   * @param game 
   */
  function handleSetGameList(game: Game) {
    let listLength: number = gameList.length;
    let gameFound = false;

    if (listLength === 0) {
      setGameList([...gameList, game]),
        setCountGames(countGames + 1)
    } else {

      for (let i = 0; i < listLength; i++) {
        if (gameList[i].name === game.name) {
          setModalTrigger(t => t + 1)
          gameFound = true;
          setShowModal(true)
          setAlert(<CustomModal key={modalTrigger} title='hola' text='The game is already in the list' type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)} />)
          break;
        }
      }
      if (!gameFound) {
        setGameList([...gameList, game]),
          setCountGames(countGames + 1)
      }
    }
  }


  /**
   * Deletes a videogame from the list searching its videogame_id
   * @param gameId 
   */
  function unselectGameList(gameId: number) {
    setGameList(gameList.filter(item => item.id !== gameId))
    setCountGames(countGames - 1)
  }


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

  /**
   * Controls if the user clicked outside the sidebar, if so it hides it
   * @param e Event
   */
  const handleClickOutside = (e: MouseEvent) => {
    if (sidebarRef.current && (!sidebarRef.current.contains(e.target as Node))) {
      setShowSidebar(false);
    }
  };

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


  useEffect(() => {
    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar])


  if (nextSlide === 1) return (<EditListInfo setNextSlide={setNextSlide} gameList={gameList}/>)
  if (nextSlide === 0)
    return (
      <section className='flex w-full min-h-screen bg-black text-white text-sm py-20'>
        {alert}
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
          <div className="flex flex-col sm:flex-row items-center mb-4">
            {/* Search bar */}
            <form className='w-full md:w-96 relative flex items-center border border-gray-400' action={formAction}>
              <input type="text" name="searchGame" id="searchGame" className='w-full bg-transparent outline-none pl-2' placeholder='Hollow Knight' />
              <button className='rounded p-1 ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
            </form>

            {/* Sidebar of games added */}
            <div ref={sidebarRef}>
              {showSidebar &&
                <div className={`absolute right-5 top-40 z-50 overflow-scroll h-96 w-[95%] sm:w-96 no-scrollbar bg-black/80 backdrop-blur-sm border border-gray-600 rounded-2xl m-2 p-4`}>
                  {gameList.map((gameInList, index) => (
                    <div key={index} className='flex items-center mb-3 w-full relative'>
                      <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-10 h-12' width={70} height={70} alt='Videogame cover sidebar' />
                      <p className='text-sm ml-4'>{gameInList.name}</p>
                      <button className='ml-8 flex items-center'><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0' onClick={() => unselectGameList(gameInList.id)} /></button>
                    </div>
                  ))}
                </div>
              }
            </div>

            <div className="flex space-x-4 ml-auto mt-2 sm:mt-0">
              {/* Games counter */}
              <button onClick={() => setShowSidebar(!showSidebar)} className="flex justify-center items-center w-32 py-1 rounded-md text-gray-400 border border-gray-400 hover:text-white hover:bg-zinc-800 transition">
                <p className='font-bold'>{countGames}</p>
                <p className='text-gray-300 ml-1'>games</p>
              </button>
              <button onClick={() => setNextSlide(1)} className="w-32 py-1 rounded-md bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                Next
              </button>
            </div>
          </div>


          {/* Games shown */}
          {isLoading ? <SkeletonBrowseGames /> :
            <div className='grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-8'>
              {gameItems.map((game, index: number) => (
                <div key={index} className={`${gameList.includes(game) ? 'border border-4 border-green-500 shadow-[inset_4px_0px_100px_50px_#19ff6e]' : ''} group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer lg:w-48 lg:h-64 transition hover:scale-110`} onClick={() => handleSetGameList(game)}>
                  <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Videogame cover' />
                  <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                    <p className='text-sm md:text-lg'>{game.name}</p>
                  </div>
                  <div className={gameList.includes(game) ? 'absolute bottom-0 right-0' : 'hidden'}>
                    <svg fill="#00ff4c" width="45px" height="45px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#00ff4c"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z"></path></g></svg>
                  </div>
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
          {gameItems.length === 0 && !isLoading &&
            <div className="w-full flex justify-center text-gray-400">
              No games found with the current filters...
            </div>
          }
        </div>
      </section>
    )




}