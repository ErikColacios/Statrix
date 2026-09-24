"use client"
import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { fetchSteamLibrary } from "@/actions/fetchSteamLibrary";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import insertSteamGames from "@/actions/insertSteamGames";

export default function ImportSteamGames() {

  const [userInfo, setUserInfo] = useState<any[]>([])
  const [steamGames, setSteamGames] = useState<any[]>([])

  const [importing, setImporting] = useState(false)

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        const session = await getSessionUser()
        const userInfo = await getUserInfo(session.user.name)

        if (userInfo.length === 0) {
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
    setImporting(true)
    const res = await insertSteamGames(steamGames)
    console.log(res)
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

          </Dialog.Content>
        </Dialog.Portal>
        <section className='flex w-full justify-center items-center text-white text-sm py-20'>
          <div className="xl:w-1/3 flex flex-col px-4 pb-24 md:px-4">
            <h2 className='text-4xl font-bold md:text-5xl pb-2'>Import Steam games</h2>
            <p className="text-gray-400 text-base">Select the games that you want to import to your Statrix library.</p>

            <div className="flex flex-col mt-4 space-y-2">
              {steamGames.length === 0 && (
                <p className="text-gray-400">No Steam games found for the user.</p>
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