"use client"
import React, { useEffect, useState } from "react";
import { fetchSteamLibrary } from "@/actions/fetchSteamLibrary";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";

export default function ImportSteamGames() {

  const [userInfo, setUserInfo] = useState<any[]>([])
  const [steamGames, setSteamGames] = useState<any[]>([])

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        const session = await getSessionUser()
        const userInfo = await getUserInfo(session.user.name)

        if (userInfo.length === 0) {
          //console.error("User info not found");
          return;
        }
        setUserInfo(userInfo)

        const steamGames = await fetchSteamLibrary(userInfo[0].user_steam_id)

        if (steamGames) {
          //console.log(steamGames)
          setSteamGames(steamGames)
        } else {
          console.error("No Steam games found for the user.");
        }

      } catch (error) {
        console.error("Error fetching Steam games:", error)
      }
    }
    fetchSteamGames()
  }, [])

  return (
    <section className='flex w-full justify-center items-center text-white text-sm py-20'>
      <div className="flex flex-col px-4 pb-24 md:px-4">
        <h2 className='text-4xl font-bold md:text-5xl pb-2'>Import Steam games</h2>
        <p className="text-gray-400 text-base">Select the games that you want to import to your Statrix library.</p>

        <div className="flex flex-col mt-4 space-y-2">
          {steamGames.length === 0 && (
            <p className="text-gray-400">No Steam games found for the user.</p>
          )}
          {steamGames.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-green-400">{steamGames.length} Steam games found.</p>
              <button  className="ml-auto rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">Import all</button>
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
  )
}