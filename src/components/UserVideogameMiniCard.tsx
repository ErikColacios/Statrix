import React from "react"

export default function UserVideogameMiniCard({ userVideogames }: any) {

    return (
        <div className='w-64 sm:w-80 py-2 pr-4 relative bg-zinc-900 border border-gray-600 cursor-pointer rounded-r-lg rounded-l-4xl text-white text-sm sm:text-base'>
            <div className={`absolute left-0 top-0 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full border border-gray-600`}>
                <img src={userVideogames.avatarImage} className="h-full w-full object-cover" alt="Avatar image" />
            </div>
            <div className="pl-19 flex flex-col items-start">
                <div className="flex space-x-2">
                    <p className="font-bold hover:text-green-500">{userVideogames.userName}</p>
                    <p className="text-gray-400">{userVideogames.action}</p>
                </div>
                <p className="font-bold hover:text-green-500">{userVideogames.gameName}</p>
            </div>
        </div>
    )
}