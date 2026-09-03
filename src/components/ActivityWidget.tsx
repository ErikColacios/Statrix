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
                <div className='w-full flex items-center bg-zinc-900 border border-gray-600 overflow-hidden rounded-lg text-white text-sm sm:text-base' key={index}>
                    <img src={activity.game_base_image} className="h-16 w-16" alt="" />
                    <div className="flex flex-col items-start pl-4 w-4/5">
                        <div className="flex space-x-2">
                            <p className="font-bold">{activity.user_name}</p>
                            <p className="text-gray-400">{activity.action}</p>
                        </div>
                        <Link href={`/gamePage/${activity.game_id}`} className="font-bold hover:text-green-500">{activity.game_name}</Link>
                    </div>
                    <p className="text-gray-400 w-1/5 pr-2">{activity.action_date.toLocaleDateString()}</p>
                </div>
            ))}

            {userActivity.length === 0 && (
                <div className='w-full h-36 flex items-center justify-center bg-zinc-900 border border-gray-600 rounded-lg text-white text-sm sm:text-base'>
                    <div className="flex flex-col text-center text-gray-400">
                        <p>(－_－) zzZ</p>
                        <p>No recent activity yet.</p>
                        <Link href={`/browseGames`} className="text-white font-bold hover:text-green-500">Go add some games!</Link>
                    </div>
                </div>
            )}
        </div>
    )
}