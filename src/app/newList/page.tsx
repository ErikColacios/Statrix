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

export default function NewList() {

  const router = useRouter()
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
   * Creates a list using the "insertList" function
   * @returns
   */
  function createList() {
    if (listName === "") {
      setShowModal(true)
      setAlert(<CustomModal key={modalTrigger} title='Hi' text='Introduce a list name' type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)} />)
      setModalTrigger(t => t + 1)

    }
    else if (countGames === 0) {
      setShowModal(true)
      setAlert(<CustomModal key={modalTrigger} title='Hi' text='You must add a game first' type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)} />)
      setModalTrigger(t => t + 1)
    }
    else {
      insertList(listName, gameList);
      router.push("mylists")
    }
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


  return (
    <section className='flex w-full bg-black text-white text-sm py-20'>
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
        {/* Search bar */}
        <form className='w-full md:w-96 mb-6 relative flex items-center border border-gray-400' action={formAction}>
          <input type="text" name="searchGame" id="searchGame" className='w-full bg-transparent outline-none pl-2' placeholder='Hollow Knight' />
          <button className='rounded p-1 ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
        </form>

        {/* Games shown */}
        {isLoading ? <SkeletonBrowseGames /> :
          <div className='grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-8'>
            {gameItems.map((game, index: number) => (
              <div key={index} className={`group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer lg:w-48 lg:h-64 transition hover:scale-110`} >
                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Game cover' />
                <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                  <p>{game.name}</p>
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
        {gameItems.length === 0 &&
          <div className="w-full flex justify-center text-gray-400">
            No games found with the current filters...
          </div>
        }
      </div>
    </section>
  )
}