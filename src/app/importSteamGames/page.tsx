"use client"
import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { fetchSteamLibrary } from "@/actions/fetchSteamLibrary";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import insertSteamGames from "@/actions/insertSteamGames";
import ImportSteamGamesModal from "@/components/ImportSteamGamesModal";
import Link from "next/link";

export default function ImportSteamGames() {

  const [userInfo, setUserInfo] = useState<any[]>([])
  const [steamGames, setSteamGames] = useState<any[]>([])

  const [importing, setImporting] = useState(false)
  const [importedGames, setImportedGames] = useState<number>(0)
  const [notFoundGames, setNotFoundGames] = useState<string[]>([])

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        const session = await getSessionUser()
        const userInfo = await getUserInfo(session.user.name)

        if (userInfo.length === 0 || !userInfo[0].user_steam_id) {
          return;
        }

        setUserInfo(userInfo)

        const steamGames = await fetchSteamLibrary(userInfo[0].user_steam_id)

        if (steamGames) {
          //console.log(steamGames)
          setSteamGames(steamGames)
        }

      } catch (error) {
        console.error("Error fetching Steam games:", error)
      }
    }
    fetchSteamGames()
  }, [])

  async function handleImportAllGames() {
    //setImporting(true)

    if (importedGames === 0) {
      const res = await insertSteamGames(steamGames)
      console.log(res)
      if (res?.success === false) {
        setNotFoundGames(res?.notFoundGames || [])
      }
      setImportedGames(res?.importedGames || 0)
    }
  }

  return (
    <>
      <Dialog.Root>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            className={`fixed w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-4/5 lg:w-3/5 2xl:w-3/7 rounded-lg shadow-xl
              data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
            <Dialog.Title className="DialogTitle"></Dialog.Title>
            <Dialog.Description className="DialogDescription"></Dialog.Description>
            <ImportSteamGamesModal importedGames={importedGames} setImportedGames={setImportedGames} notFoundGames={notFoundGames} setNotFoundGames={setNotFoundGames} steamGames={steamGames} />
          </Dialog.Content>
        </Dialog.Portal>
        <section className='flex w-full justify-center items-center text-white text-sm py-20'>
          <div className="xl:w-1/3 flex flex-col px-4 pb-24 md:px-4">
            <Link href={"/settings"} className="group flex items-center text-green-500 text-md hover:text-green-600 border border-green-600 w-20 rounded-sm mb-6">
              <svg className="w-6 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
              Back
            </Link>
            <h2 className='text-4xl font-bold md:text-5xl pb-4'>Import Steam games</h2>
            <p className="text-gray-400 text-base">Select the games that you want to import to your Statrix library.</p>
            <p className="text-gray-400 text-base mt-2">This process skips duplicated games.</p>
            <p className="text-gray-400 text-base mt-2">Note that if no games are shown, maybe you need to set your Steam profile to public.</p>

            <div className="flex flex-col mt-4 space-y-2">
              {steamGames.length === 0 && (
                <p className="text-yellow-400">No games found in your Steam library.</p>
              )}
              {steamGames.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-green-400">{steamGames.length} Steam games found.</p>
                  <Dialog.Trigger onClick={handleImportAllGames} className="ml-auto rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">Import all</Dialog.Trigger>
                </div>
              )}
            </div>

            <div className="flex flex-col mt-4 space-y-4">
              {steamGames.map((game, index: number) => (
                <div className="flex items-center" key={index}>
                  <img src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`} className='w-8 rounded-xl' alt='Steam game icon' />
                  <p className="ml-4 text-xl">{game.name}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </Dialog.Root>
    </>
  )
}