'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { getListInfo } from '@/actions/getListInfo';
import { useSession } from 'next-auth/react';
import updateListInfo from '@/actions/updateListInfo';
import { useRouter } from "next/navigation";

export default function ImportSteamGamesModal() {

    const router = useRouter()
    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [error, setError] = useState<string | null>(null)


    return (
        <div className="w-full h-full sm:h-160 flex flex-col justify-center sm:border sm:border-gray-600 px-4 py-10 md:px-10 text-white sm:rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="absolute right-5 top-20 sm:right-10 sm:top-10 p-2 rounded-sm transition hover:bg-gray-800">
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <p className="text-3xl pt-8">Edit list info</p>

            <div>
                Importing games...
            </div>
        </div>
    )
}