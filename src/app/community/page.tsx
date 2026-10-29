import React from 'react'
import Link from 'next/link'
import getFeedActivity from '@/actions/getFeedActivity'
import getPopularLists from '@/actions/getPopularLists'
import CardSlider from '@/components/CardSlider'
import List from '@/components/landing/List'

// Provisional page: the final design (sidebar, onboarding checklist, load more) comes in the next step
export default async function Community() {
    const [feed, popular] = await Promise.all([getFeedActivity(), getPopularLists()])

    return (
        <div className="w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20 pb-8">
            <section className="relative pt-10 pb-4">
                <h2 className="max-w-[14ch] text-display-md font-semibold text-balance">Activity</h2>
                <p className="mt-4 max-w-[56ch] text-lg text-smoke text-pretty">
                    Check the latest moves of players like you in the community.
                </p>
            </section>
            {feed.activity.length === 0 && <p className="text-gray-400">No activity yet.</p>}

            <CardSlider>
                {feed.activity.map((activity: FeedActivity) => (
                    <div key={activity.activity_id}
                        className="group relative min-h-80 overflow-hidden rounded-2xl border border-edge bg-cover bg-center"
                        style={{ backgroundImage: `url(${activity.game_base_image})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10 transition group-hover:via-void/50" />
                        {/* Darkens the top of the cover so the user header is readable */}
                        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void/90 to-transparent" />
                        <div className="relative flex h-full min-h-80 flex-col justify-between p-5">
                            <div className="relative z-10 flex items-center gap-3">
                                <Link href={`/profile/${activity.user_name}`} className="shrink-0">
                                    <img
                                        src={
                                            activity.user_avatar
                                                ? `https://media.statrix.app/avatars/${activity.user_id}/${activity.user_avatar}`
                                                : '/avatarImages/avatar_default.jpg'
                                        }
                                        className="h-11 w-11 rounded-full object-cover ring-2 ring-white/20 transition hover:ring-green-400"
                                        alt="Avatar image"/>
                                </Link>
                                <div className="min-w-0">
                                    <Link
                                        href={`/profile/${activity.user_name}`}
                                        className="block truncate text-base font-bold hover:text-green-400">
                                        {activity.user_name}
                                    </Link>
                                    <p className="text-xs text-gray-400">{new Date(activity.action_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 first-letter:uppercase">{activity.action}</p>
                                {/* The after: pseudo-element stretches this link over the whole card */}
                                <Link
                                    href={`/gamePage/${activity.game_id}`}
                                    className="mt-1 text-xl font-semibold line-clamp-2 after:absolute after:inset-0 hover:text-green-400">
                                    {activity.game_name}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </CardSlider>

            {popular.lists.length === 0 && <p className="text-gray-400">No public lists yet.</p>}
            <section className="relative pt-10 pb-4">
                <h2 className="max-w-[14ch] text-display-md font-semibold text-balance">New Lists</h2>
                <p className="mt-4 max-w-[56ch] text-lg text-smoke text-pretty">
                    Some fresh lists for you to take a look.
                </p>
            </section>

            <CardSlider slideClassName="w-80! sm:w-md! lg:w-lg!">

                {popular.lists.map((list: PopularList) => (
                    <Link key={list.list_id} href={`/list/${list.list_id}`} className="block">
                        {/* List expects the camelCase shape used by the landing page */}
                        <List
                            list={{
                                listName: list.list_name,
                                userName: list.user_name,
                                listGames: list.total_games,
                                listMode: list.list_mode,
                                listCreationDate: new Date(list.list_creationdate).toLocaleDateString(),
                                covers: list.covers.map(cover => ({ gameBaseImage: cover })),
                            }}
                        />
                    </Link>
                ))}
            </CardSlider>
        </div>
    )
}
