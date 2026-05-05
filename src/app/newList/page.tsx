"use client"
import React from "react";
import { getCovers } from '@/actions/getCovers'
import { insertList } from '@/actions/insertList'
import CustomModal from '@/components/CustomModal'
import { Game } from '@/types/Game'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import SkeletonNewList from './skeleton'

export default function NewList() {

  const router = useRouter()
  let [videogameItems, setVideogameItems] = useState<Game[]>([])
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
          setAlert(<CustomModal key={modalTrigger} title='hola' text='The game is already in the list' type='alert' action={{ actionName: "displayAlert", parameters: { showModal }}} closeModal={() => setShowModal(false)}/>)
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
      setAlert(<CustomModal key={modalTrigger} title='Hi' text='Introduce a list name' type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)}/>)
      setModalTrigger(t => t + 1)

    }
    else if (countGames === 0) {
      setShowModal(true)
      setAlert(<CustomModal key={modalTrigger} title='Hi' text='You must add a game first' type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={() => setShowModal(false)}/>)
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
    setGenre(genreId);
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


  useEffect(() => {
    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar])


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
          {isLoading ? <SkeletonNewList /> :
            <div className='grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-8'>
              {videogameItems.map((videogame, index: number) => (
                <div key={index} className={`${gameList.includes(videogame) ? 'border border-4 border-green-500 shadow-[inset_4px_0px_100px_50px_#19ff6e]' : ''} group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer lg:w-48 lg:h-64 transition hover:scale-110`} onClick={() => handleSetGameList(videogame)}>
                  <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${videogame.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Videogame cover' />
                  <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                    <p className='text-sm md:text-lg'>{videogame.name}</p>
                  </div>

                  <div className={gameList.includes(videogame) ? 'absolute bottom-0 right-0' : 'hidden'}>
                    <svg fill="#00ff4c" width="45px" height="45px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#00ff4c"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z"></path></g></svg>
                  </div>
                </div>
              ))}
            </div>}
        </div>
      </div>
      <div className='fixed flex w-full h-20 bg-zinc-900 p-2 bottom-0'>
        {/* Sidebar of games added */}
        <div ref={sidebarRef}>
          {showSidebar &&
            <div className={`fixed bottom-20 z-50 overflow-scroll h-96 w-[95%] sm:w-96 no-scrollbar bg-black/80 backdrop-blur-sm border border-gray-600 rounded-2xl m-2 p-4`}>
              {gameList.map((gameInList, index) => (
                <div key={index} className='flex items-center mb-3 w-full relative'>
                  <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-10 h-12' width={70} height={70} alt='Videogame cover sidebar' />
                  <p className='text-sm ml-4'>{gameInList.name}</p>
                  <button className='ml-8 flex items-center'><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0' onClick={() => unselectGameList(gameInList.id)} /></button>
                </div>
              ))}
            </div>
          }
          {/* Games counter */}
          <div onClick={() => setShowSidebar(!showSidebar)} className='flex space-x-2 text-sm xl:text-xl items-center justify-center w-32 xl:w-96 bg-black/70 backdrop-blur-sm cursor-pointer border hover:border-green-500 pt-2 pb-2 m-2 z-50'>
            <p className='font-bold'>{countGames}</p>
            <p className='text-gray-300'>games added</p>
          </div>
        </div>

        <div className='flex items-center justify-center md:text-3xl md:ml-12'>
          <p className='hidden sm:flex'>List name</p>
          <input type="text" placeholder='Relaxing games' className='bg-transparent border-b border-white pb-1 ml-2 mr-4 md:ml-4 h-8 w-36 lg:h-16 md:w-80 lg:w-96 outline-none' onChange={(e) => setListName(e.target.value)} />
          <button onClick={() => createList()} className="text-sm md:text-lg text-white px-3 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
            Create
          </button>
        </div>
      </div>
    </section>
  )
}