import React from 'react'
import Link from 'next/link'
import getFeedActivity from '@/actions/getFeedActivity'
import getPopularLists from '@/actions/getPopularLists'
import CardSlider from '@/components/CardSlider'
import List from '@/components/landing/List'
import UserHoverCard from '@/components/UserHoverCard'

// Provisional page: the final design (sidebar, onboarding checklist, load more) comes in the next step
export default async function Community() {
    const [feed, popular] = await Promise.all([getFeedActivity(), getPopularLists()])

    return (
        <div className="relative isolate w-full min-w-0 px-4 pt-28 pb-16 md:pt-32">
            {/* Background glows */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]">
                <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_30%_0%,rgba(34,197,94,0.14),transparent_72%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(30%_40%_at_85%_10%,rgba(163,230,53,0.07),transparent_70%)]" />
            </div>

            {/* Header */}
            <div>
                <p className="text-sm font-semibold text-green-400">Community</p>
                <h1 className="mt-3 text-display-md font-semibold text-balance headline-sheen">What everyone is playing.</h1>
                <p className="mt-3 max-w-[56ch] text-base text-smoke text-pretty">The latest moves of players like you, and fresh lists to discover new games.</p>
            </div>

            {/* Activity */}
            <section className="mt-14">
                <div className="mb-5 flex items-end gap-4 border-b border-edge pb-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center">
                            <img src="/staticImages/icon_activity_gray.png" alt="" className="w-4" />
                        </span>
                        <div>
                            <h2 className="text-2xl font-semibold">Activity</h2>
                            <p className="text-sm text-smoke">Check the latest moves of players like you in the community.</p>
                        </div>
                    </div>
                    {feed.activity.length > 0 && <span className="ml-auto hidden sm:inline-flex rounded-full border border-edge bg-white/[0.03] px-3 py-1 text-xs text-smoke">{feed.activity.length} updates</span>}
                </div>

                {feed.activity.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-edge bg-white/[0.02] px-4 py-14 text-center">
                        <p className="font-semibold">No activity yet</p>
                        <p className="text-sm text-smoke">When players start tracking games, you will see it here.</p>
                    </div>
                )}

                <CardSlider>
                    {feed.activity.map((activity: FeedActivity) => (
                        <div key={activity.activity_id}
                            className="group relative min-h-80 overflow-hidden rounded-2xl border border-edge bg-card bg-cover bg-center transition duration-300 hover:-translate-y-1 hover:border-green-500/50 hover:shadow-[0_25px_50px_-20px_rgba(34,197,94,0.45)]"
                            style={{ backgroundImage: `url(${activity.game_base_image})` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10 transition group-hover:via-void/50" />
                            {/* Darkens the top of the cover so the user header is readable */}
                            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void/90 to-transparent" />
                            <div className="relative flex h-full min-h-80 flex-col justify-between p-5">
                                <div className="relative z-10 flex items-center gap-3">
                                    <UserHoverCard userName={activity.user_name}>
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
                                    </UserHoverCard>
                                    <div className="min-w-0">
                                        <UserHoverCard userName={activity.user_name}>
                                            <Link
                                                href={`/profile/${activity.user_name}`}
                                                className="block truncate text-base font-bold hover:text-green-400">
                                                {activity.user_name}
                                            </Link>
                                        </UserHoverCard>
                                        <p className="text-xs text-gray-400">{new Date(activity.action_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    {/* Action badge, with the same colors as the game status in My games */}
                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold first-letter:uppercase
                                        ${activity.action === "started playing" ? "border-blue-500/40 bg-blue-500/15 text-blue-300" : ""}
                                        ${activity.action === "completed" ? "border-green-500/40 bg-green-500/15 text-green-300" : ""}
                                        ${activity.action === "dropped" ? "border-rose-500/40 bg-rose-500/15 text-rose-300" : ""}
                                        ${activity.action === "updated status" ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300" : ""}
                                        ${activity.action === "starred" ? "border-amber-500/40 bg-amber-500/15 text-amber-300" : ""}
                                        ${activity.action.startsWith("rated") && Number(activity.action.split(" ")[1]) >= 8 ? "border-green-500/40 bg-green-500/15 text-green-300" : ""}
                                        ${activity.action.startsWith("rated") && Number(activity.action.split(" ")[1]) >= 4 && Number(activity.action.split(" ")[1]) < 8 ? "border-yellow-500/40 bg-yellow-500/15 text-yellow-300" : ""}
                                        ${activity.action.startsWith("rated") && Number(activity.action.split(" ")[1]) < 4 ? "border-rose-500/40 bg-rose-500/15 text-rose-300" : ""}`}>
                                        {activity.action}
                                    </span>
                                    {/* The after: pseudo-element stretches this link over the whole card */}
                                    <Link
                                        href={`/gamePage/${activity.game_id}`}
                                        className="mt-2 block text-xl font-semibold line-clamp-2 after:absolute after:inset-0 hover:text-green-400">
                                        {activity.game_name}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardSlider>
            </section>

            {/* New lists */}
            <section className="mt-16">
                <div className="mb-5 flex items-end gap-4 border-b border-edge pb-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center">
                            <img src="/staticImages/icon_list.png" alt="" className="w-4" />
                        </span>
                        <div>
                            <h2 className="text-2xl font-semibold">New lists</h2>
                            <p className="text-sm text-smoke">Some fresh lists for you to take a look.</p>
                        </div>
                    </div>
                    <Link href="/newList" className="ml-auto hidden sm:inline-flex items-center gap-1 rounded-full border border-edge bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-smoke transition hover:border-green-500/40 hover:text-snow">
                        <span className="text-base leading-none">+</span> Create yours
                    </Link>
                </div>

                {popular.lists.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-edge bg-white/[0.02] px-4 py-14 text-center">
                        <p className="font-semibold">No public lists yet</p>
                        <p className="text-sm text-smoke">Be the first one to share a list with the community.</p>
                    </div>
                )}

                <CardSlider slideClassName="w-80! sm:w-md! lg:w-lg!">
                    {popular.lists.map((list: PopularList) => (
                        <Link key={list.list_id} href={`/list/${list.list_id}`} className="block transition duration-300 hover:-translate-y-1">
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
            </section>
        </div>
    )
}
