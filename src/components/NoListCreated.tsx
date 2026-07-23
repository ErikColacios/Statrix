import React from "react";
import Link from "next/link";

export default async function NoListCreated(){
    return (
        <div className='flex justify-center items-center bg-zinc-900 border border-gray-600 rounded-sm rounded-xl h-96'>
            <div className='flex flex-col text-center items-center space-y-4 p-2'>
                <p className='text-xl font-bold'>No lists yet</p>
                <p className="sm:w-2/3 text-center text-gray-400">Create your first gaming list. You can create as many lists as you need to organize your library.</p>
                <Link href={"/newList"} className="text-white px-6 py-1 rounded bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                + Create list
                </Link>
            </div>
        </div>
    )
}