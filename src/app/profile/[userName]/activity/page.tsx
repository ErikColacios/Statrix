import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserActivity } from '@/actions/getUserActivity'
import getUserInfo from '@/actions/getUserInfo'
import BackLink from '@/components/BackLink'

// The profile only shows the last 5, here we show a longer history
const ACTIVITY_LIMIT = 50

export async function generateMetadata({ params }: { params: { userName: string } }): Promise<Metadata> {
    return { title: `${params.userName}'s activity - Statrix` }
}

// Groups the activity by day, keeping the order (newest first)
function groupByDay(userActivity: Activity[]) {
    const groups = new Map<string, Activity[]>()

    for (const activity of userActivity) {
        const day = new Date(activity.action_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        groups.set(day, [...(groups.get(day) ?? []), activity])
    }

    return Array.from(groups)
}

export default async function Activity({ params }: { params: { userName: string } }) {

    const userInfo = await getUserInfo(params.userName)
    if (userInfo.length === 0) redirect('/')

    const userActivity = await getUserActivity(params.userName, ACTIVITY_LIMIT)
    const activityByDay = groupByDay(userActivity)

    return (
        <div className='w-full sm:w-5/6 lg:w-3/5 2xl:w-2/5 px-4 pt-20 pb-8'>
            <BackLink href={`/profile/${params.userName}`}>Back to profile</BackLink>

            <section className="pt-6 pb-8">
                <h2 className="text-4xl font-semibold text-balance break-words">
                    <span className="text-green-500">{userInfo[0].user_name}</span>'s activity
                </h2>
                <p className="mt-4 max-w-[56ch] text-lg text-smoke text-pretty">
                    Everything this player has been adding, playing and finishing lately.
                </p>
            </section>

            {userActivity.length === 0 && (
                <div className='w-full h-36 flex items-center justify-center rounded-lg border border-white/10 bg-zinc-900/40 backdrop-blur-lg'>
                    <div className="flex flex-col text-center text-gray-400">
                        <p>(－_－) zzZ</p>
                        <p>No recent activity yet.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col space-y-8">
                {activityByDay.map(([day, activities]) => (
                    <div key={day}>
                        <p className="flex items-center mb-2 pl-1 text-base text-gray-400">
                            <img src="/staticImages/icon_activity_gray.png" alt="Activity icon" className="w-4 h-4 mr-2" />
                            {day}
                        </p>
                        <div className="flex flex-col space-y-2">
                            {activities.map((activity) => (
                                <div key={activity.activity_id}
                                    className="group relative flex items-center overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 backdrop-blur-lg transition hover:border-green-500/50 hover:bg-zinc-900/70">
                                    <img src={activity.game_base_image} className="w-14 h-18 md:w-16 md:h-20 object-cover shrink-0" alt="Game cover" />
                                    <div className="min-w-0 px-4">
                                        <p className="text-sm text-gray-400 first-letter:uppercase">{activity.action}</p>
                                        {/* The after: pseudo-element stretches this link over the whole card */}
                                        <Link href={`/gamePage/${activity.game_id}`}
                                            className="block truncate font-bold text-base md:text-lg after:absolute after:inset-0 group-hover:text-green-400">
                                            {activity.game_name}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
