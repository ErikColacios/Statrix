"use client"
import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { fetchSteamLibrary } from "@/actions/fetchSteamLibrary";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import insertSteamGames from "@/actions/insertSteamGames";
import ImportSteamGamesModal from "@/components/ImportSteamGamesModal";
import Link from "next/link";

export default function ImportSteamGames() {

  const [userInfo, setUserInfo] = useState<any[]>([])
  let [steamGames, setSteamGames] = useState<any[]>([])
  const stopImportingRef = useRef(false)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasSteamLinked, setHasSteamLinked] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")

  const [gamesCount, setGamesCount] = useState<number>(0)
  const [importedGames, setImportedGames] = useState<number>(0)
  const [notFoundGames, setNotFoundGames] = useState<string[]>([])
  // Games being imported (passed to the modal)
  const [selectedGames, setSelectedGames] = useState<any[]>([])
  // Games checked in the list, by Steam appid
  const [selectedAppIds, setSelectedAppIds] = useState<number[]>([])

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        const session = await getSessionUser()
        const userInfo = await getUserInfo(session.user.name)

        if (userInfo.length === 0 || !userInfo[0].user_steam_id) {
          setHasSteamLinked(false)
          return;
        }

        setUserInfo(userInfo)

        const steamGames = await fetchSteamLibrary(userInfo[0].user_steam_id)

        if (steamGames) {
          // Most played games first
          setSteamGames([...steamGames].sort((a: any, b: any) => (b.playtime_forever ?? 0) - (a.playtime_forever ?? 0)))
        }
      } catch (error) {
        console.error("Error fetching Steam games:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSteamGames()
  }, [])


  function toggleGame(appid: number) {
    setSelectedAppIds(prev => prev.includes(appid) ? prev.filter(id => id !== appid) : [...prev, appid])
  }

  function toggleAllGames() {
    setSelectedAppIds(selectedAppIds.length === steamGames.length ? [] : steamGames.map(game => game.appid))
  }

  async function handleImportGames(importMode: string) {
    const gamesToImport = importMode === "importAll" ? steamGames : steamGames.filter(game => selectedAppIds.includes(game.appid))

    // Reset the progress of a previous import
    setSelectedGames(gamesToImport)
    setImportedGames(0)
    setNotFoundGames([])
    setGamesCount(0)
    stopImportingRef.current = false

    let gamesCount = 1
    let importedGamesCount = 0

    for (const game of gamesToImport) {
      if (stopImportingRef.current) {
        console.log("Import cancelled")
        break
      }

      const res = await insertSteamGames(game)

      if (res?.success === false) {
        setNotFoundGames(prev => [...prev, game.name])
      } else {
        importedGamesCount++
        setImportedGames(importedGamesCount)
      }

      setGamesCount(gamesCount++)
    }
  }

  function formatPlaytime(minutes: number): string {
    if (!minutes) return "Not played"
    const hours: number = Math.round(minutes / 60)
    return hours < 1 ? "< 1 h" : `${hours.toLocaleString("en-US")} h`
  }

  const filteredGames = steamGames.filter(game => game.name?.toLowerCase().includes(search.toLowerCase()))
  const allSelected: boolean = steamGames.length > 0 && selectedAppIds.length === steamGames.length

  return (
    <>
      <Dialog.Root>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content onInteractOutside={(e) => e.preventDefault()}
            className={`fixed w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-4/5 lg:w-3/5 2xl:w-2/5 rounded-lg shadow-xl
              data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
            <Dialog.Title className="DialogTitle"></Dialog.Title>
            <Dialog.Description className="DialogDescription"></Dialog.Description>
            <ImportSteamGamesModal importedGames={importedGames} setImportedGames={setImportedGames} notFoundGames={notFoundGames} setNotFoundGames={setNotFoundGames} selectedGames={selectedGames} gamesCount={gamesCount} setGamesCount={setGamesCount} stopImportingRef={stopImportingRef} />
          </Dialog.Content>
        </Dialog.Portal>

        <section className="relative isolate min-h-screen w-full bg-void text-snow text-sm">
          {/* Background glows */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]">
            <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(34,197,94,0.14),transparent_72%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(30%_40%_at_85%_20%,rgba(56,189,248,0.07),transparent_70%)]" />
          </div>

          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 pt-28 pb-24 md:pt-32">
            <Link href={"/settings"} className="group inline-flex items-center gap-1 rounded-full border border-edge bg-white/[0.03] py-1.5 pl-2 pr-4 text-smoke transition hover:border-green-500/40 hover:text-snow">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Settings
            </Link>

            {/* Header */}
            <div className="mt-8 flex items-start gap-5">
              <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-edge bg-card shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)]">
                <img src="/staticImages/icon_steam.png" alt="Steam" className="w-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-400">Steam</p>
                <h1 className="mt-2 text-display-md font-semibold text-balance headline-sheen">Import your Steam library.</h1>
                <p className="mt-3 max-w-[56ch] text-base text-smoke text-pretty">Select the games that you want to import to your Statrix library.</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-edge bg-card/60 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <p className="text-smoke">Games already in your library are skipped, so nothing gets duplicated.</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-edge bg-card/60 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-400 font-bold">i</span>
                <p className="text-smoke">If no games are shown, you may need to set your Steam profile and game details to public.</p>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="mt-10 grid gap-2 sm:grid-cols-2">
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="h-16 rounded-xl border border-edge bg-elevated animate-pulse" />
                ))}
              </div>
            )}

            {/* Steam not linked */}
            {!isLoading && !hasSteamLinked && (
              <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge bg-white/[0.02] px-6 py-14 text-center">
                <img src="/staticImages/icon_steam_gray.png" alt="" className="w-10 opacity-60" />
                <p className="text-lg font-semibold">Your Steam account is not linked</p>
                <p className="max-w-[44ch] text-smoke">Link your Steam account from the settings to import your games.</p>
                <Link href="/settings" className="mt-2 flex h-11 items-center rounded-full bg-linear-to-r from-green-500 to-lime-500 px-6 font-semibold text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition duration-300 hover:from-green-400 hover:to-lime-400">
                  Go to settings
                </Link>
              </div>
            )}

            {/* Empty library */}
            {!isLoading && hasSteamLinked && steamGames.length === 0 && (
              <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-yellow-500/30 bg-yellow-500/[0.03] px-6 py-14 text-center">
                <p className="text-lg font-semibold">No games found in your Steam library</p>
                <p className="max-w-[48ch] text-smoke">Check that your Steam profile and game details are public, then reload this page.</p>
              </div>
            )}

            {/* Games */}
            {!isLoading && steamGames.length > 0 && (
              <>
                {/* Toolbar */}
                <div className="sticky top-16 z-20 mt-10 -mx-4 sm:mx-0 border-b sm:border border-edge bg-void/85 px-4 py-3 backdrop-blur-xl sm:rounded-2xl">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <p className="text-smoke"><span className="font-semibold text-snow">{steamGames.length}</span> games found</p>
                      <span className="h-1 w-1 rounded-full bg-edge" />
                      <p className="text-smoke"><span className="font-semibold text-green-400">{selectedAppIds.length}</span> selected</p>
                    </div>
                    <div className="flex gap-2 sm:ml-auto">
                      <button onClick={toggleAllGames} className="h-10 rounded-xl border border-edge bg-white/[0.03] px-4 font-medium text-smoke transition hover:border-green-500/40 hover:text-snow">
                        {allSelected ? "Clear selection" : "Select all"}
                      </button>
                      {selectedAppIds.length > 0
                        ? <Dialog.Trigger onClick={() => handleImportGames("importSelected")}
                            className="flex-1 sm:flex-none h-10 rounded-xl bg-linear-to-r from-green-500 to-lime-500 px-5 font-semibold text-white shadow-lg shadow-green-900/40 transition duration-300 hover:from-green-500 hover:to-lime-600">
                            Import selected ({selectedAppIds.length})
                          </Dialog.Trigger>
                        : <Dialog.Trigger onClick={() => handleImportGames("importAll")}
                            className="flex-1 sm:flex-none h-10 rounded-xl bg-linear-to-r from-green-500 to-lime-500 px-5 font-semibold text-white shadow-lg shadow-green-900/40 transition duration-300 hover:from-green-500 hover:to-lime-600">
                            Import all
                          </Dialog.Trigger>}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="mt-3 flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-green-500 focus-within:bg-white/10">
                    <img src="/staticImages/icon_search.png" alt="" className="w-4 opacity-60" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search your Steam games"
                      className="h-full w-full bg-transparent text-snow outline-hidden placeholder:text-zinc-500" placeholder="Search your Steam games..." />
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {filteredGames.map((game) => {
                    const selected: boolean = selectedAppIds.includes(game.appid)
                    return (
                      <button key={game.appid} onClick={() => toggleGame(game.appid)} aria-pressed={selected}
                        className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition
                        ${selected ? "border-green-500/60 bg-green-500/[0.08]" : "border-edge bg-card/60 hover:border-white/20 hover:bg-card"}`}>
                        <img src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`} className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover" alt="" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-snow">{game.name}</p>
                          <p className="text-xs text-smoke">{formatPlaytime(game.playtime_forever)}</p>
                        </div>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition
                          ${selected ? "border-transparent bg-linear-to-br from-green-400 to-lime-400 text-black" : "border-white/25 text-transparent group-hover:border-white/50"}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {filteredGames.length === 0 && (
                  <p className="mt-6 text-center text-smoke">No games match “{search}”.</p>
                )}
              </>
            )}
          </div>
        </section>
      </Dialog.Root>
    </>
  )
}
