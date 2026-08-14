import React from "react"

export default function UserVideogameMiniCard() {

    return (
        <div className='w-96 py-2 pr-4 relative bg-zinc-900 border border-gray-600 rounded-r-lg rounded-l-4xl text-white'>
            <div className={`absolute left-0 top-0 w-16 h-16 overflow-hidden rounded-full border border-gray-600`}>
                <img src={`/avatarImages/sora.jpg`} className="h-full w-full object-cover" alt="Avatar image" />
            </div>
            <div className="pl-19 flex flex-col items-start">
                <div className="flex space-x-2">
                    <p className="font-bold hover:text-green-500">erikMaster</p>
                    <p className="text-gray-400">started playing</p>
                </div>
                <p className="font-bold hover:text-green-500">Kingdom Hearts 3</p>
            </div>
        </div >
    )
}