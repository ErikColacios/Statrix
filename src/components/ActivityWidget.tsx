"use server"
import Link from "next/link"
import React from "react"

type Props = {
    userActivity: Activity[],
    canEdit: boolean
}

export default async function ActivityWidget({ userActivity, canEdit }: Props) {
    return (
        <div className="flex flex-col space-y-2">
            {userActivity.length === 0 && (
                <div className='w-full h-36 flex items-center justify-center rounded-lg border border-dashed border-white/15 p-4 text-sm'>
                    <div className="flex flex-col text-center text-gray-400">
                        <p>(－_－) zzZ</p>
                        <p>No recent activity yet.</p>
                        {canEdit && <Link href={`/browseGames`} className="text-white font-bold hover:text-green-500">Go add some games!</Link>}
                    </div>
                </div>
            )}
            {userActivity.map((activity: Activity) => (
                <div className='w-full flex items-center overflow-hidden rounded-lg border border-white/10 bg-white/5 text-white text-sm' key={activity.activity_id}>
                    <img src={activity.game_base_image} className="w-12 h-16 object-cover" alt="Game cover" />
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

        </div>
    )
}