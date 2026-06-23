'use client'
import React from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { insertList } from '@/actions/insertList';

export default function EditListInfo({ setNextSlide, gameList }: any) {

    const router = useRouter()
    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [error, setError] = useState<string | null>(null)
    const [selectedVisibility, setSelectedVisibility] = useState<string | undefined>();
    const [isFeatured, setIsFeatured] = useState<boolean>(false);


    function createList() {
        const listNameElement: HTMLInputElement = document.getElementById("listName") as HTMLInputElement
        const listDescriptionElement: HTMLInputElement = document.getElementById("listDescription") as HTMLInputElement
        const listName: string = listNameElement.value;
        const listDescription: string = listDescriptionElement.value;

        if (listName === "") {
            setError("The list name cannot be empty")
        }
        else if (gameList.length === 0) {
            setError("You must add at least 1 game to create a list")
        }
        else {
            insertList(listName, listDescription, selectedVisibility, gameList);
            router.push("mylists")
        }
    }


    return (
        <div className='w-full flex justify-center'>
            <div className="w-full xl:w-1/2 flex flex-col p-4 pt-20 sm:p-20 min-h-screen text-white">
                <p className="text-3xl">List information</p>
                <div className="flex flex-col text-sm mt-8" >
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400">List name</p>
                        <input type="text" name="listName" id="listName" className='rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-600' />
                    </div>


                    <p className="text-sm text-gray-400 mt-4">List description</p>
                    <textarea rows={7} name="listDescription" id='listDescription' maxLength={250} className="w-full rounded p-1 bg-gray-800 outline-none border border-gray-700 focus:border-green-700 resize-none" />

                    <fieldset className='flex flex-col space-y-1'>
                        <label className="inline-flex items-center mt-4 mb-1">Visibility</label>
                        <div className='flex flex-col space-x-5 items-start'>
                            <div className='flex space-x-2'>
                                <input type="radio" id="public" name="listVisibility" value="public" className='accent-green-600'
                                    onChange={(e) => setSelectedVisibility(e.target.value)} />
                                <label htmlFor="public" className=''>Public</label>
                            </div>
                            <p className='text-gray-400'>Everyone can see this list</p>
                        </div>

                        <div className='flex flex-col space-x-5 items-start'>
                            <div className='flex space-x-2'>
                                <input type="radio" id="friendsOnly" name="listVisibility" value="friendsOnly" className='accent-green-600'
                                    onChange={(e) => setSelectedVisibility(e.target.value)} />
                                <label htmlFor="friendsOnly" className=''>Friends only</label>
                            </div>
                            <p className='text-gray-400'>Only friends can see this list</p>
                        </div>

                        <div className='flex flex-col space-x-5 items-start'>
                            <div className='flex space-x-2'>
                                <input type="radio" id="private" name="listVisibility" value="private" className='accent-green-600'
                                    onChange={(e) => setSelectedVisibility(e.target.value)} />
                                <label htmlFor="private">Private</label>
                            </div>
                            <p className='text-gray-400'>Only you can see this list</p>
                        </div>

                        <div className='flex flex-col pt-6'>
                            <div className='flex space-x-6'>
                                <label htmlFor="listFeatured" className="text-sm">Featured list</label>
                                <input type="checkbox" name="listFeatured" id="listFeatured" className='accent-green-500' onChange={() => setIsFeatured(!isFeatured)} />
                            </div>
                            <p className='text-gray-400'>Mark this to display this list in your profile</p>
                        </div>
                    </fieldset>

                    <div className='flex items-center space-x-4 ml-auto mt-3'>
                        {error && <div className="text-red-500">{error}</div>}
                        <button onClick={() => setNextSlide(0)} className="px-4 py-1 rounded text-gray-400 border border-gray-400 hover:text-white hover:bg-zinc-800 transition">
                            Back
                        </button>
                        <button onClick={createList} className="px-4 py-1 rounded bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}