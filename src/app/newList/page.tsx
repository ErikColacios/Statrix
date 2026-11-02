"use client"
import React from "react";
import { fetchGamesIGDB } from '@/actions/fetchGamesIGDB'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import EditListInfo from "@/components/EditListInfo";
import { GameIGDB } from "@/types/GameIGDB";
import SkeletonNewList from "./skeleton";
import { Dialog, Toast } from "radix-ui";
import { motion } from "framer-motion"

// IGDB ids. Horror is a theme in IGDB, not a genre, so it filters by theme instead
const genres = [
  { name: "Trending", genre: 0, theme: 0 },
  { name: "Shooter", genre: 5, theme: 0 },
  { name: "RPG", genre: 12, theme: 0 },
  { name: "Horror", genre: 0, theme: 19 },
  { name: "Fighting", genre: 4, theme: 0 },
  { name: "Racing", genre: 10, theme: 0 },
  { name: "Sport", genre: 14, theme: 0 },
  { name: "Simulator", genre: 13, theme: 0 },
]

export default function NewList() {

  const [gameItems, setGameItems] = useState<GameIGDB[]>([])
  const [gameList, setGameList] = useState<GameIGDB[]>([])
  const [countGames, setCountGames] = useState(0)
  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)
  const [theme, setTheme] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame, undefined)

  // States for the modals and alerts
  const [showModal, setShowModal] = useState(false)
  const [modalTrigger, setModalTrigger] = useState(0)

  const [responseOffset, setResponseOffset] = useState<number>(0)
  const [responseLimit, setResponseLimit] = useState<number>(63)

  const [nextSlide, setNextSlide] = useState<number>(0)

  // Toast state
  const timerRef = useRef(0)
  const [openToast, setOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])


  useEffect(() => {
    const fetchGames = async () => {
      try {
        // While we fetch the covers, we display the loading animation, then we remove it
        setIsLoading(true)
        const covers: GameIGDB[] = await fetchGamesIGDB(gameNameSearch, genre, responseOffset, responseLimit, theme)
        if (covers) {
          setGameItems(covers)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
      }
    }
    fetchGames()
  }, [gameNameSearch, genre, theme, responseLimit])


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
          gameFound = true;
          setShowModal(true)
          setToastMessage("The game is already in the list")
          setOpenToast(false)
          window.clearTimeout(timerRef.current)
          timerRef.current = window.setTimeout(() => { setOpenToast(true) }, 100)
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

  // Checked by id, so a selected game stays marked after changing the page or the genre
  function isSelected(game: GameIGDB): boolean {
    return gameList.some((item: GameIGDB) => item.id === game.id)
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
   * Clears the search input and goes back to the selected genre
   */
  function handleClearSearch() {
    const searchGame: HTMLInputElement = document.getElementById("searchGame") as HTMLInputElement
    searchGame.value = ""
    setGameNameSearch("")
  }

  /**
   * Changes the genre (or the theme, for categories like horror)
   */
  function handleSetGenre(genreId: number, themeId: number = 0) {
    setGenre(genreId)
    setTheme(themeId)
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

  const currentPage: number = Math.round(responseOffset / 64) + 1
  const currentGenreName: string = genres.find((g) => g.genre === genre && g.theme === theme)?.name ?? "Trending"

    // Fade up animation
    const fadeUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        viewport: { once: true, amount: 0.05 }
    }

  // When clicking the 'Next' button, we change the window to 'Edit list info'
  if (nextSlide === 1) return (<EditListInfo setNextSlide={setNextSlide} gameList={gameList} setGameList={setGameList} />)

  if (nextSlide === 0)
    return (
      <section className="relative isolate w-full min-h-screen bg-void text-snow text-sm">
        {/* Background glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(34,197,94,0.16),transparent_72%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(30%_40%_at_15%_20%,rgba(163,230,53,0.08),transparent_70%)]" />
        </div>

        <Toast.Provider>
        <Dialog.Root>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }} className={`fixed flex justify-center left-1/2 w-full h-full sm:h-auto sm:w-4/5 lg:w-3/5 2xl:w-2/6 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl
                data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
              <Dialog.Title className="DialogTitle"></Dialog.Title>
              <Dialog.Description className="DialogDescription"></Dialog.Description>

              {/* Games added modal */}
              <div className="relative w-full h-full sm:h-auto flex flex-col sm:border border-white/15 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl">
                <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                  <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
                </div>

                <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </Dialog.Close>

                <div className="relative flex flex-col gap-6 px-4 pt-20 pb-8 sm:pt-8 md:p-10">
                  <div className="pr-10">
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">Current games</h2>
                    <p className="text-sm text-zinc-400 mt-1">{countGames} {countGames === 1 ? "game" : "games"} in your new list</p>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[60vh] sm:max-h-96 overflow-y-auto no-scrollbar">
                    {gameList.map((gameInList: GameIGDB, index: number) => (
                      <div key={index} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-2 pr-3 transition hover:bg-white/5">
                        <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-10 aspect-3/4 rounded-md object-cover' alt='Game cover' />
                        <p className='min-w-0 flex-1 truncate font-medium'>{gameInList.name}</p>
                        <button aria-label={`Remove ${gameInList.name}`} onClick={() => unselectGameList(gameInList.id)}
                          className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-zinc-400 transition hover:border-rose-400 hover:bg-rose-500/20 hover:text-white'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {gameList.length === 0 &&
                      <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 px-4 py-10 text-center text-zinc-400">
                        <p className="font-medium text-white">No games yet</p>
                        <p>Click on any cover to add it to your list.</p>
                      </div>}
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-28 pb-40 md:pt-32">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-semibold text-green-400">New list</p>
              <h1 className="mt-4 text-display-md font-semibold text-balance headline-sheen">Build your list.</h1>
              <p className="mt-4 max-w-[52ch] text-base text-smoke text-pretty">Pick the games that belong together. You will name it and set the order in the next step.</p>

              {/* Search bar */}
              <form action={formAction}
                className="mt-8 flex h-14 w-full max-w-xl items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-5 pr-1.5 shadow-[0_20px_60px_-25px_rgba(34,197,94,0.45)] backdrop-blur transition focus-within:border-green-500 focus-within:bg-white/10">
                <img src="/staticImages/icon_search.png" alt="Search" className="w-5 shrink-0 opacity-60" width={20} height={20} />
                <input
                  type="text"
                  name="searchGame"
                  id="searchGame"
                  autoComplete="off"
                  aria-label="Search games"
                  className="h-full w-full min-w-0 bg-transparent text-base text-snow outline-hidden placeholder:text-zinc-500"
                  placeholder="Hollow Knight, Elden Ring, Hades..."/>
                {gameNameSearch !== "" &&
                  <button type="button" onClick={handleClearSearch} aria-label="Clear search"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>}
                <button type="submit"
                  className="h-11 shrink-0 rounded-full bg-linear-to-r from-green-400 to-lime-400 px-5 font-semibold text-white transition duration-300 hover:from-green-300 hover:to-lime-300">
                  Search
                </button>
              </form>

              {/* Genres */}
              <div className="mt-6 flex w-full max-w-full gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap sm:justify-center">
                {genres.map((g) => (
                  <button key={g.name} onClick={() => handleSetGenre(g.genre, g.theme)}
                    className={`shrink-0 rounded-full border px-4 py-1.5 font-medium transition
                    ${genre === g.genre && theme === g.theme && gameNameSearch === ""
                      ? "border-transparent bg-linear-to-r from-green-400 to-lime-400 text-white shadow-[0_0_30px_-8px_rgba(34,197,94,0.7)]"
                      : "border-edge bg-white/[0.03] text-smoke hover:border-green-500/40 hover:text-snow"}`}>
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results header */}
            <div className="mt-14 mb-5 flex items-end justify-between gap-4 border-b border-edge pb-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-smoke">{gameNameSearch !== "" ? "Search results" : "Category"}</p>
                <h2 className="mt-1 truncate text-2xl font-semibold">{gameNameSearch !== "" ? `“${gameNameSearch}”` : currentGenreName}</h2>
              </div>
              {gameItems.length !== 0 && !isLoading && <p className="shrink-0 text-smoke">Page {currentPage}</p>}
            </div>

            {/* Games shown */}
            {isLoading ? <SkeletonNewList /> :
              <motion.section {...fadeUp} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
                {gameItems.map((game: GameIGDB, index: number) => {
                  const selected: boolean = isSelected(game)
                  return (
                    <div key={index} className="flex flex-col">
                      <button onClick={() => handleSetGameList(game)} aria-label={selected ? `${game.name} (selected)` : `Add ${game.name}`} aria-pressed={selected}
                        className={`group relative block w-full aspect-[3/4] overflow-hidden rounded-xl border bg-card cursor-pointer transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500
                        ${selected
                          ? "border-green-500 ring-2 ring-green-500/60 shadow-[0_20px_40px_-15px_rgba(34,197,94,0.55)]"
                          : "border-edge hover:border-green-500/60 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.45)]"}`}>
                        <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`}
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          alt="Videogame cover" />
                        {selected && <div className="absolute inset-0 bg-green-500/15" />}
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 hidden translate-y-2 p-3 text-left opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                          <p className="line-clamp-2 font-semibold leading-tight">{game.name}</p>
                          <span className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium
                            ${selected ? "border-white/20 bg-white/10 text-zinc-300" : "border-green-500/40 bg-green-500/15 text-green-400"}`}>
                            {selected ? "In your list" : "+ Add"}
                          </span>
                        </div>

                        {/* Selected check */}
                        {selected &&
                          <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-lime-400 text-black shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                          </span>}
                      </button>
                      <p className="mt-1.5 line-clamp-2 text-xs text-smoke sm:hidden">{game.name}</p>
                    </div>
                  )
                })}
              </motion.section>}
            {gameItems.length !== 0 && !isLoading &&
              <div className="w-full flex items-center justify-center gap-3 pt-12">
                <button
                  className="flex h-10 items-center gap-1 rounded-full border border-edge bg-white/[0.03] px-4 font-medium text-smoke transition hover:border-green-500/40 hover:text-snow disabled:pointer-events-none disabled:opacity-40"
                  disabled={responseOffset === 0}
                  onClick={() => handlePagination('previous')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  Prev
                </button>
                <span className="flex h-10 min-w-10 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 px-3 font-semibold text-green-400">{currentPage}</span>
                <button
                  className="flex h-10 items-center gap-1 rounded-full border border-edge bg-white/[0.03] px-4 font-medium text-smoke transition hover:border-green-500/40 hover:text-snow"
                  onClick={() => handlePagination('next')}>
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            }
            {gameItems.length === 0 && !isLoading &&
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-edge bg-white/[0.02] px-4 py-16 text-center">
                <p className="text-lg font-semibold">No games found</p>
                <p className="text-smoke">Try another name or pick a different category.</p>
              </div>
            }
          </div>

          {/* Selected games bar */}
          <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/85 p-2 pl-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <Dialog.Trigger className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-left transition hover:bg-white/5">
                <div className="flex shrink-0">
                  {gameList.slice(-3).map((gameInList: GameIGDB) => (
                    <img key={gameInList.id} src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`}
                      className="-ml-3 first:ml-0 h-10 w-8 rounded-md object-cover ring-2 ring-zinc-950" alt="" />
                  ))}
                  {gameList.length === 0 &&
                    <div className="h-10 w-8 rounded-md border border-dashed border-white/20" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{countGames} {countGames === 1 ? "game" : "games"} selected</p>
                  <p className="truncate text-xs text-smoke">{gameList.length === 0 ? "Click on a cover to add it" : "View and edit your selection"}</p>
                </div>
              </Dialog.Trigger>
              {/* Next slide button */}
              <button onClick={() => {
                    gameList.map((game:GameIGDB, index:number)=> {
                      game.order = index+1
                  }),
                setNextSlide(1)}}
                className="flex h-11 shrink-0 items-center gap-1 rounded-xl bg-linear-to-r from-green-500 to-lime-500 px-5 font-semibold text-white shadow-lg shadow-green-900/40 transition duration-300 hover:from-green-500 hover:to-lime-600">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </Dialog.Root>
          <Toast.Root className={`z-99 fixed animate-slide-left flex flex-col bottom-24 right-5 sm:right-15 text-white
              rounded shadow-rose-500/30 border-rose-600 p-2 cardReviewRed`} open={openToast} onOpenChange={setOpenToast}>
                  <Toast.Description>
                      <div className="flex items-center space-x-2">
                          <img src="/staticImages/icon_error_circle.png" alt="Success icon" className="w-5 h-5" />
                          <p>{toastMessage}</p>
                      </div>
                  </Toast.Description>
                  <Toast.Close/>
              </Toast.Root>
              <Toast.Viewport/>
          </Toast.Provider>
      </section>
    )
}
