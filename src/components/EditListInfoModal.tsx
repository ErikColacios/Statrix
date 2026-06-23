'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { getListInfo } from '@/actions/getListInfo';
import { useSession } from 'next-auth/react';
import updateListInfo from '@/actions/updateListInfo';
import { useRouter } from "next/navigation";

export default function EditListInfoModal({ listId }: { listId: string }) {

    const router = useRouter()
    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [listInfo, setListInfo] = useState<any>([])
    const [error, setError] = useState<string | null>(null)
    const [selectedVisibility, setSelectedVisibility] = useState<string | null>();
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    useEffect(() => {
        const fetchListInfo = async () => {
            const res = await getListInfo(listId)
            setListInfo(res[0])
            setSelectedVisibility(res[0].list_visibility)
            setIsFeatured(res[0].list_featured)
        }

        fetchListInfo()
    }, [])

    async function saveChanges(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const formData = new FormData(e.currentTarget)
            if (formData.get("listName") === "") {
                throw new Error('The list name cannot be empty')
            }
            const listName = formData.get("listName") as string
            const listDescription = formData.get("listDescription") as string

            const listVisibility = formData.get("listVisibility") as string

            await updateListInfo(listId, listName, listDescription, listVisibility, isFeatured)
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
        <div className="w-full h-164 flex-col border border-gray-600 px-4 py-12 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-10 top-10 p-2 rounded-sm transition hover:bg-gray-800">
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <p className="text-3xl">Edit list info</p>

            <form className="flex flex-col text-sm mt-8" onSubmit={saveChanges}>
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400">List name</p>
                    <input type="text" name="listName" id="listName" className='rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-600'
                        defaultValue={listInfo.list_name} />
                </div>


                <p className="text-sm text-gray-400 mt-4">List description</p>
                <textarea rows={7} name="listDescription" id='listDescription' maxLength={250} className="w-full rounded-sm p-1 bg-gray-800 outline-hidden border border-gray-700 focus:border-green-700 resize-none"
                    defaultValue={listInfo.list_description} />

                <fieldset className='flex flex-col space-y-1'>
                    <label className="inline-flex items-center mt-4 mb-1">Visibility</label>
                    <div className='flex flex-col space-x-5 items-start'>
                        <div className='flex space-x-2'>
                            <input type="radio" id="public" name="listVisibility" value="public" className='accent-green-600'
                                checked={selectedVisibility === "public"} onChange={(e) => setSelectedVisibility(e.target.value)} />
                            <label htmlFor="public" className=''>Public</label>
                        </div>
                        <p className='text-gray-400'>Everyone can see this list</p>
                    </div>

                    <div className='flex flex-col space-x-5 items-start'>
                        <div className='flex space-x-2'>
                            <input type="radio" id="friendsOnly" name="listVisibility" value="friendsOnly" className='accent-green-600'
                                checked={selectedVisibility === "friendsOnly"} onChange={(e) => setSelectedVisibility(e.target.value)} />
                            <label htmlFor="friendsOnly" className=''>Friends only</label>
                        </div>
                        <p className='text-gray-400'>Only friends can see this list</p>
                    </div>

                    <div className='flex flex-col space-x-5 items-start'>
                        <div className='flex space-x-2'>
                            <input type="radio" id="private" name="listVisibility" value="private" className='accent-green-600'
                                checked={selectedVisibility === "private"} onChange={(e) => setSelectedVisibility(e.target.value)} />
                            <label htmlFor="private">Private</label>
                        </div>
                        <p className='text-gray-400'>Only you can see this list</p>
                    </div>

                    <div className='flex flex-col pt-6'>
                        <div className='flex space-x-6'>
                            <label htmlFor="listFeatured" className="text-sm">Featured list</label>
                            <input type="checkbox" name="listFeatured" id="listFeatured" className='accent-green-500' checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)}/>
                        </div>

                        <p className='text-gray-400'>Mark this to display this list in your profile</p>
                    </div>

                </fieldset>

                <div className='flex items-center mt-3'>
                    {error && <div className="text-red-500">{error}</div>}
                    <button type="submit" className="ml-auto px-4 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    )
}