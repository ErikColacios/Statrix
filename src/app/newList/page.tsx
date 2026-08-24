"use client"
import React from "react";
import { fetchGamesIGDB } from '@/actions/fetchGamesIGDB'
import CustomModal from '@/components/CustomModal'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import EditListInfo from "@/components/EditListInfo";
import { GameIGDB } from "@/types/GameIGDB";
import SkeletonNewList from "./skeleton";
import { Dialog } from "radix-ui";

export default function NewList() {

  const [gameItems, setGameItems] = useState<GameIGDB[]>([])
  const [gameList, setGameList] = useState<GameIGDB[]>([])
  const [countGames, setCountGames] = useState(0)
  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)

  // States for the modals and alerts
  const [showModal, setShowModal] = useState(false)
  const [modalTrigger, setModalTrigger] = useState(0)

  // Custom alert
  const [alert, setAlert] = useState(<></>)

  const [responseOffset, setResponseOffset] = useState<number>(0)
  const [responseLimit, setResponseLimit] = useState<number>(64)

  const [nextSlide, setNextSlide] = useState<number>(0)


  useEffect(() => {
    const fetchGames = async () => {
      try {
        // While we fetch the covers, we display the loading animation, then we remove it
        setIsLoading(true)
        const covers: GameIGDB[] = await fetchGamesIGDB(gameNameSearch, genre, responseOffset, responseLimit)
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
  function handleSetGameList(game: GameIGDB) {
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

  // When clicking the 'Next' button, we change the window to 'Edit list info'
  if (nextSlide === 1) return (<EditListInfo setNextSlide={setNextSlide} gameList={gameList} />)

  if (nextSlide === 0)
    return (
      <section className='flex w-full min-h-screen bg-black text-white text-sm py-20'>
        <Dialog.Root>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }} className={`fixed flex justify-center left-1/2 w-full h-full sm:h-auto sm:w-4/5 lg:w-3/5 2xl:w-2/6 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
              <Dialog.Title className="DialogTitle"></Dialog.Title>
              <Dialog.Description className="DialogDescription"></Dialog.Description>

              {/* Games added modal */}
              <div className="flex flex-col h-full w-full sm:h-[56vh] border border-gray-600 space-y-4 px-4 sm:px-12 text-white rounded-2xl bg-black/80 backdrop-blur-lg">
                <Dialog.Close className="mt-8 absolute top-10 sm:top-0 right-5 p-2 sm:rounded-sm transition hover:bg-gray-800">
                  <svg width="28px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
                </Dialog.Close>
                <h2 className="text-3xl text-start mt-18 sm:mt-8">Current games</h2>

                <div className="flex flex-col sm:h-96 overflow-scroll no-scrollbar space-y-2 mt-6">
                  {gameList.map((gameInList: GameIGDB, index: number) => (
                    <div key={index} className="w-full flex items-center rounded-lg md:text-lg border border-gray-500 bg-zinc-900 hover:bg-zinc-800">
                      <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-12 rounded' alt='Game cover' />
                      <p className='text-sm ml-4'>{gameInList.name}</p>
                      <button className='ml-auto mr-2 flex items-center justify-center rounded-full border border-gray-400 transition hover:bg-zinc-900 p-1' onClick={() => unselectGameList(gameInList.id)}>
                        <svg width="10px" height="10px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
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


          <section className="flex flex-col w-full px-4 pb-24 md:px-4">
            <div className="pb-6">
              <h2 className='text-4xl font-bold md:text-5xl pb-2'>New list</h2>
              <p className="text-gray-400">Start creating a list by adding some games</p>
            </div>

            <div className="flex flex-col sm:space-x-2 sm:flex-row items-center mb-4">
              {/* Search bar */}
              <form className='w-full md:w-96 relative flex items-center border border-gray-400 rounded-md' action={formAction}>
                <input type="text" name="searchGame" id="searchGame" className='w-full bg-transparent outline-hidden pl-2' placeholder='Hollow Knight' />
                <button className='rounded-sm p-1 ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
              </form>

              <div className="w-full flex space-x-4 ml-auto mt-2 sm:mt-0">
                {/* Games counter */}
                {gameList.length !== 0 &&
                  <Dialog.Trigger className="flex justify-center items-center w-1/2 sm:w-32 py-1 rounded-md text-gray-400 border border-gray-400 hover:text-white hover:bg-zinc-800 transition">
                    <p className='font-bold'>{countGames}</p>
                    <p className='text-gray-300 ml-1'>games</p>
                  </Dialog.Trigger>}
                {/* Next slide button */}
                <button onClick={() => setNextSlide(1)} className="w-1/2 sm:w-32 py-1 rounded-md bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                  Next
                </button>
              </div>
            </div>

            {/* Games shown */}
            {isLoading ? <SkeletonNewList /> :
              <div className='grid justify-center grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-8 gap-6'>
                {gameItems.map((game: GameIGDB, index: number) => (
                  <div key={index} >
                    <div className={`${gameList.includes(game) ? 'border border-3 border-green-500 ' : ''} group relative flex flex-col justify-center items-center overflow-hidden rounded-xl cursor-pointer lg:w-48 lg:h-64 transition hover:scale-105`} onClick={() => handleSetGameList(game)}>
                      <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`} className='w-full h-full transition duration-300 rounded-lg group-hover:blur-xs group-hover:brightness-50' alt='Videogame cover' />
                      <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                        <p className="hidden sm:contents">{game.name}</p>
                      </div>
                      <div className={gameList.includes(game) ? 'absolute bottom-0 right-0' : 'hidden'}>
                        <svg fill="#00ff4c" width="45px" height="45px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#00ff4c"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M760 380.4l-61.6-61.6-263.2 263.1-109.6-109.5L264 534l171.2 171.2L760 380.4z"></path></g></svg>
                      </div>
                    </div>
                    <p className="h-12 pt-1 text-center sm:hidden text-sm">{game.name}</p>
                  </div>

                ))}
              </div>}
            {gameItems.length !== 0 &&
              <div className="w-full flex justify-center text-gray-400 space-x-2 py-6">
                <button className="rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                  disabled={responseOffset === 0}
                  onClick={() => handlePagination('previous')}>Prev</button>
                <button className="rounded-sm border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                  onClick={() => handlePagination('next')}>Next</button>
              </div>
            }
            {gameItems.length === 0 && !isLoading &&
              <div className="w-full flex justify-center text-gray-400">
                No games found with the current filters...
              </div>
            }
          </section>
        </Dialog.Root>
      </section>
    )
}