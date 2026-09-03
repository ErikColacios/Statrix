import React from 'react'
import { getUserActivity } from '@/actions/getUserActivity'
import Link from 'next/link'

export default async function Activity({ params }: { params: { userName: string } }) {

    const userActivity = await getUserActivity(params.userName)

    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20 pb-8'>
            <Link href={`/profile/${params.userName}`} className="group flex items-center text-green-500 text-md hover:text-green-600 border border-green-600 w-38 rounded-sm mb-6">
                <svg className="w-6 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
                Back to profile
            </Link>
            <div className="flex items-center space-x-4 mb-8">
                <h2 className='text-4xl font-bold md:text-5xl'>{params.userName}'s activity</h2>
            </div>

            <div className='flex flex-col space-y-4'>
                {userActivity.map((activity: Activity, index: number) => (
                    <div className='w-full flex items-center bg-zinc-900 border border-gray-600 overflow-hidden rounded-lg text-white text-base' key={index}>
                        <img src={activity.game_base_image} className="w-12 h-14 md:w-18 md:h-22" alt="Game cover" />
                        <div className="flex flex-col items-start pl-4 w-4/5">
                            <div className="flex space-x-2">
                                <p className="font-bold">{activity.user_name}</p>
                                <p className="text-gray-400">{activity.action}</p>
                            </div>
                            <Link href={`/gamePage/${activity.game_id}`} className="font-bold hover:text-green-500">{activity.game_name}</Link>
                        </div>
                        <p className="text-sm md:text-base text-gray-400 w-1/5 pr-2">{activity.action_date.toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}