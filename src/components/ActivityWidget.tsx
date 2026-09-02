"use server"
import Link from "next/link"
import React from "react"

type Props = {
    userActivity: Activity[]
}

export default async function ActivityWidget({ userActivity }: Props) {
    return (
        <div className="flex flex-col space-y-2">
            {userActivity.map((activity: Activity, index: number) => (
                <div className='w-full flex items-center space-x-8 py-1 pr-4 relative bg-zinc-900 border border-gray-600 rounded-lg text-white text-sm sm:text-base' key={index}>
                    <div className={`absolute left-0 top-0 w-12 h-12 sm:w-14 sm:h-14 overflow-hidden border border-gray-600`}>
                        <img src={activity.game_base_image} className="h-full w-full object-cover" alt="Avatar image" />
                    </div>
                    <div className="pl-19 flex flex-col items-start">
                        <div className="flex space-x-2">
                            <p className="font-bold hover:text-green-500">{activity.user_name}</p>
                            <p className="text-gray-400">{activity.action}</p>
                        </div>
                        <Link href={`/gamePage/${activity.game_id}`} className="font-bold hover:text-green-500">{activity.game_name}</Link>
                    </div>
                    <p className="text-gray-400">{activity.action_date.toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    )
}