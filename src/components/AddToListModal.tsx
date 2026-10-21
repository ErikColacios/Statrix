"use client"
import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import updateListOneGame from "../actions/updateListOneGame";
import { getListsUser } from "@/actions/getListsUser";
import { useSession } from "next-auth/react";
import { List } from "@/types/List";
import { getListContent } from "@/actions/getListContent";
import Link from "next/link";

type Props = {
    game_id: number,
    game_name: string,
    game_base_image: string,
    setNextSlide: any
};

export default function AddToListModal({ game_id, game_name, game_base_image, setNextSlide }: Props) {

    const session: any = useSession()
    const userId: string = session?.data?.user?.id as string
    const [lists, setLists] = useState<List[]>([])
    const [selectedList, setSelectedList] = useState<List>()

    useEffect(() => {
        // Fetch the lists which don't have the game we are adding
        async function fetchLists() {
            let userLists: List[] = await getListsUser(userId, false)
            let listsToFilter: List[] = []

            for (const list of userLists) {
                const listId: string = list.list_id
                const listContent: any = await getListContent(listId)

                listContent.map((content: any) => {
                    if (content.game_id == game_id) {
                        listsToFilter.push(list)
                    }
                })
            }

            for (const listToFilter of listsToFilter) {
                userLists = userLists.filter((userList: List) => userList !== listToFilter)
            }

            setLists(userLists)
        }
        fetchLists()
    }, [])


    async function handleAddToList() {
        // Update the list adding only this one game
        if (selectedList)
            await updateListOneGame(selectedList, game_id, game_name, game_base_image)
    }

    // game_base_image is the IGDB image id
    const coverSrc: string = `https://images.igdb.com/igdb/image/upload/t_720p/${game_base_image}.png`

    const labelClass = "text-xs font-medium uppercase tracking-wider text-zinc-400"

    return (
        <div className="relative w-full h-full flex flex-col justify-center sm:border border-white/15 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl animate-slide-left">

            {/* Blurred cover backdrop */}
            <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                <img src={coverSrc} alt="" className="w-full h-full object-cover scale-125 blur-3xl opacity-25" />
                <div className="absolute inset-0 bg-linear-to-br from-zinc-700/20 via-zinc-950/80 to-zinc-950/95" />
            </div>

            <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Dialog.Close>

            <div className="relative flex flex-col gap-6 p-6 sm:p-8">
                {/* Header with the game being added */}
                <div className="flex items-center gap-4 sm:pr-10">
                    <img src={coverSrc} alt="Game cover" className="w-14 aspect-3/4 object-cover rounded-lg shadow-xl ring-1 ring-white/10" />
                    <div className="min-w-0">
                        <p className="text-2xl md:text-3xl font-bold leading-tight">Add to list</p>
                        <p className="text-sm text-zinc-400 truncate">{game_name}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {lists.length !== 0 && <p className={labelClass}>Choose a list</p>}
                    <div className="flex flex-col gap-2 max-h-96 sm:max-h-64 overflow-y-auto no-scrollbar">
                        {lists.map((list: List, index: number) => {
                            const isSelected: boolean = list === selectedList
                            // getListsUser returns covers as rows with game_base_image and total_games
                            const covers: any[] = list.covers as any[]
                            const totalGames: number = covers.length > 0 ? Number(covers[0].total_games) : 0

                            return (
                                <button key={index} onClick={() => setSelectedList(list)}
                                    className={`w-full flex items-center gap-4 text-left rounded-xl border p-3 transition
                                    ${isSelected ? "bg-green-500/10 border-green-500" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`}>

                                    {/* Stacked covers preview */}
                                    <div className="flex shrink-0 -space-x-4 w-20">
                                        {covers.slice(0, 3).map((cover: any, coverIndex: number) => (
                                            <img key={coverIndex} src={cover.game_base_image} alt="" className="w-9 aspect-3/4 object-cover rounded-md ring-2 ring-zinc-900" />
                                        ))}
                                        {covers.length === 0 && <div className="w-9 aspect-3/4 rounded-md border border-dashed border-white/20" />}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <p className="font-medium truncate">{list.list_name}</p>
                                        <p className="text-xs text-zinc-400">{list.list_mode} · {totalGames} {totalGames === 1 ? "game" : "games"}</p>
                                    </div>

                                    <span className={`ml-auto shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 transition
                                        ${isSelected ? "border-green-500 bg-linear-to-r from-green-500 to-lime-500" : "border-white/30"}`}>
                                        {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                                    </span>
                                </button>
                            )
                        })}

                        {lists.length === 0 &&
                            <div className="w-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 py-8 px-4 text-center">
                                <p className="text-zinc-300">You don't have any lists yet.</p>
                                <p className="text-sm text-zinc-400">Create the first one!</p>
                            </div>}
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full flex gap-3">
                    <button onClick={() => setNextSlide(0)} className="flex items-center justify-center h-11 px-5 rounded-xl font-medium bg-white/5 border border-white/15 transition hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6" /></svg>
                        Back
                    </button>
                    {lists.length === 0 && <Link href={"/newList"} className="flex items-center justify-center flex-1 h-11 px-6 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                        + Create list
                    </Link>}
                    {selectedList && <Dialog.Close onClick={handleAddToList} className="flex items-center justify-center flex-1 h-11 px-6 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                        <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3 mr-2" />
                        Save
                    </Dialog.Close>}
                </div>
            </div>
        </div>
    )
}
