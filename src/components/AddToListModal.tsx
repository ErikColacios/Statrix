"use client"
import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import updateListOneGame from "../actions/updateListOneGame";
import { getListsUser } from "@/actions/getListsUser";
import { useSession } from "next-auth/react";
import { List } from "@/types/List";
import { getListContent } from "@/actions/getListContent";

type Props = {
    game_id: string,
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
        // We update the list adding only this one game
        if (selectedList)
            await updateListOneGame(selectedList, game_id, game_name, game_base_image);
    }

    return (
        <div className='w-full h-full sm:ml-48 sm:w-96  flex flex-col items-center justify-center sm:items-start sm:border border-gray-600 p-8 text-white sm:rounded-2xl backdrop-blur-lg transition bg-black/80 animate-slide-left'>
            <Dialog.Close className="absolute right-5 sm:right-10 top-15 sm:top-10 p-2 rounded-sm transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <p className="text-3xl">Add to list</p>
            <div className="w-full flex flex-col text-sm mt-2" >
                <div className="w-full text-sm ">
                    <p className="text-gray-200">{game_name}</p>
                    <p className="text-gray-400 mt-4 mb-1">Choose a list</p>
                    <div className="flex flex-col space-y-2 max-h-96 sm:max-h-46 overflow-y-scroll no-scrollbar">
                        {lists.map((list: List, index: number) => (
                            <div className="w-full flex bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 cursor-pointer rounded-2xl p-4" key={index}
                                onClick={() => setSelectedList(list)} >
                                <p>{list.list_name}</p>
                                <button className={`ml-auto w-4 h-4 ml-4 rounded-full ${list === selectedList ? 'bg-linear-to-r from-green-500 to-lime-500' : 'bg-white'}`}></button>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex space-x-2 mt-4">
                        <button onClick={() => setNextSlide(0)} className="ml-auto px-4 py-1 rounded-sm text-gray-400 border border-gray-400 hover:text-white hover:bg-zinc-800 transition">
                            Back
                        </button>
                        {selectedList && <button onClick={handleAddToList} className="flex items-center px-4 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                            <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3 mr-2" />
                            Save
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}