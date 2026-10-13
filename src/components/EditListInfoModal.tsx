'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { getListInfo } from '@/actions/getListInfo';
import { useSession } from 'next-auth/react';
import updateListInfo from '@/actions/updateListInfo';
import { useRouter } from "next/navigation";
import { ListMode } from '@/enums/ListMode';
import { GameIGDB } from '@/types/GameIGDB';
import { Game } from '@/types/Game';

export default function EditListInfoModal({ listId, listContent }: { listId: string, listContent:Game[] }) {

    const router = useRouter()
    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [listInfo, setListInfo] = useState<any>([])
    const [error, setError] = useState<string | null>(null)
    const [selectedVisibility, setSelectedVisibility] = useState<string>("");
    const [selectedMode, setSelectedMode] = useState<ListMode>(ListMode.UNRANKED)
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    useEffect(() => {
        const fetchListInfo = async () => {
            const res = await getListInfo(listId)
            setListInfo(res[0])
            setSelectedVisibility(res[0].list_visibility)
            setIsFeatured(res[0].list_featured)
            setSelectedMode(res[0].list_mode)
        }

        fetchListInfo()
    }, [])

    async function saveChanges() {
        try {
            const listNameElement: HTMLInputElement = document.getElementById('listName') as HTMLInputElement
            const listDescriptionElement: HTMLInputElement = document.getElementById('listDescription') as HTMLInputElement
            const listName: string = listNameElement.value
            const listDescription: string = listDescriptionElement.value

            if (listName === '') {
                throw new Error('The list name cannot be empty')
            }

            await updateListInfo(listId, listName, listDescription, selectedVisibility, isFeatured, selectedMode, listContent)
            router.refresh()

            // We simulate that the user presses ESC to close the modal
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                which: 27,
                bubbles: true
            });

            document.dispatchEvent(escEvent);
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <div className="w-full h-full sm:h-180 flex flex-col justify-center sm:border sm:border-gray-600 px-4 py-10 md:px-10 text-white sm:rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-5 top-20 sm:right-10 sm:top-10 p-2 rounded-sm transition hover:bg-gray-800">
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <p className="text-3xl pt-46 sm:pt-0">Edit list info</p>

            <div className="flex flex-col text-sm mt-8">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400">List name</p>
                    <input type="text" name="listName" id="listName" className='rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600'
                        defaultValue={listInfo.list_name} />
                </div>


                <p className="text-sm text-gray-400 mt-4">List description</p>
                <textarea rows={7} name="listDescription" id='listDescription' maxLength={250} className="w-full rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-700 resize-none"
                    defaultValue={listInfo.list_description} />

                <p className='text-gray-400 mt-4'>Visibility</p>
                <section className='flex flex-col sm:flex-row sm:space-x-2 space-y-3 sm:space-y-0 text-xl'>
                    <button onClick={() => setSelectedVisibility("public")}
                        className={`${selectedVisibility === "public" ? "bg-green-600/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center sm:w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                        <img src="/staticImages/icon_world.png" alt="Public icon" className='w-5 mb-1'/>
                        <p className="text-xl font-bold">Public</p>
                        <p className="text-sm text-gray-500 mt-1">Visible for anyone</p>
                    </button>
                    <button onClick={() => setSelectedVisibility("friends-only")}
                        className={`${selectedVisibility === "friends-only" ? "bg-green-600/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center sm:w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                        <img src="/staticImages/icon_friends.png" alt="Friends icon" className='w-5 mb-1'/>
                        <p className="text-xl font-bold">Friends only</p>
                        <p className="text-sm text-gray-500 mt-1">Only your friends can see it</p>
                    </button>
                    <button onClick={() => setSelectedVisibility("private")}
                        className={`${selectedVisibility === "private" ? "bg-green-600/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center sm:w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                        <img src="/staticImages/icon_locked.png" alt="Private icon" className='w-5 mb-1'/>
                        <p className="text-xl font-bold">Private</p>
                        <p className="text-sm text-gray-500 mt-1">Only you can access this list</p>
                    </button>
                </section>
                
                <p className='text-gray-400 mt-4'>Mode</p>
                <section className='flex space-x-2 text-xl'>
                    <button onClick={() => setSelectedMode(ListMode.UNRANKED)} 
                        className={`${selectedMode === ListMode.UNRANKED ? "bg-green-500/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                        <img src="/staticImages/icon_unordered-list.png" alt="Cup icon" className='w-5 mb-1'/>
                        <p className="text-xl font-bold">Unranked</p>
                        <p className="text-sm text-gray-500 mt-1">Unordered list</p>
                    </button>
                    <button onClick={() => setSelectedMode(ListMode.RANKED)} 
                        className={`${selectedMode === ListMode.RANKED ? "bg-green-500/20 border-green-600" : "bg-white/[0.03] border-white/10"} flex flex-col items-center w-48 border rounded-xl p-4 transition hover:border-green-600`}>
                        <img src="/staticImages/icon_cup.png" alt="Cup icon" className='w-4 mb-1'/>
                        <p className="text-xl font-bold">Ranked</p>
                        <p className="text-sm text-gray-500 mt-1">Ranked list</p>
                    </button>
                </section>

                <div className='flex items-center mt-3'>
                    {error && <div className="text-red-500">{error}</div>}
                    <button onClick={saveChanges} className="ml-auto px-4 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    )
}