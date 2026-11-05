import React from "react";
import type { Metadata } from "next";
import getUserGameReviews from "@/actions/getUserGameReviews";
import getUserGameStats from "@/actions/getUserGameStats";
import getUserInfo from "@/actions/getUserInfo";
import { getUserTotalReviews } from "@/actions/getUserTotalReviews";
import Link from "next/link";
import getSessionUser from "@/actions/getSessionUser";
import { redirect } from "next/navigation";
import { List } from "@/types/List";
import { getListsUser } from "@/actions/getListsUser";
import ListsGrid from "@/components/ListsGrid";
import { getUserFavouriteGames } from "@/actions/getUserFavouriteGames";
import FavouriteGames from "@/components/FavouriteGames";
import { Game } from "@/types/Game";
import ActivityWidget from "@/components/ActivityWidget";
import { getUserActivity } from "@/actions/getUserActivity";
import ShareCardButton from "@/components/ShareCardButton";

// Title, description and Open Graph data of the profile, so a shared link shows the user.
// The image comes from ./opengraph-image.tsx
export async function generateMetadata({ params }: { params: { userName: string } }): Promise<Metadata> {
    const userInfo = await getUserInfo(params.userName).catch(() => [])
    if (userInfo.length === 0) return { title: "Profile - Statrix" }

    const user = userInfo[0]
    //const stats = await getUserGameStats(params.userName)
    const title = `${user.user_name} - Statrix`
    const description = `${user.user_bio ? ` "${user.user_bio}"` : ""}`

    return {
        title,
        description,
        alternates: { canonical: `/profile/${user.user_name}` },
        openGraph: {
            type: "profile",
            username: user.user_name,
            url: `/profile/${user.user_name}`,
            siteName: "Statrix",
            locale: "en_US",
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    }
}

export default async function Profile({ params }: { params: { userName: string } }) {

    const session: any = await getSessionUser()

    if (session?.user.isNewUser) {
        redirect("/newUser")
    }

    const userInfo = await getUserInfo(params.userName)
    if (userInfo.length == 0) { redirect("/") }

    const user = userInfo[0]
    const canEdit: boolean = params.userName == session?.user?.name

    // Independent queries, so they run in parallel
    const [userGameStats, userTotalReviews, userReviews, favouriteGames, userActivity, featuredLists] = await Promise.all([
        getUserGameStats(params.userName),
        getUserTotalReviews(params.userName),
        getUserGameReviews(params.userName),
        getUserFavouriteGames(params.userName) as Promise<Game[]>,
        getUserActivity(params.userName, 5),
        getListsUser(user.user_id, true) as Promise<List[]>,
    ])
    const userLists = featuredLists.slice(0, 3) // We show only the top 3 featured lists
    const lastReview = userReviews[0]
    const mostPlayed = userGameStats.topGames[0]

    const avatarImage = user.user_avatar ? `https://media.statrix.app/avatars/${user.user_id}/${user.user_avatar}` : "/avatarImages/avatar_default.jpg"
    const bannerImage = user.user_banner ? `https://media.statrix.app/banners/${user.user_id}/${user.user_banner}` : "/bannerImages/banner_default.jpg"
    const joinedDate = new Date(user.user_creationdate).toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return (
        <section className="relative isolate min-h-screen bg-black text-white">
            {/* The banner, blurred, tints the top of the page */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] overflow-hidden">
                <img src={bannerImage} alt="" className="h-full w-full scale-110 object-cover opacity-30 blur-3xl" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/60 to-black" />
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16">
                <div className="grid gap-3 lg:grid-cols-12">

                    {/* Profile - widget */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg flex flex-col lg:col-span-7">
                        {/* Banner with the avatar over its bottom edge. The avatar is centered over the left column */}
                        <div className="relative">
                            <img src={bannerImage} alt="Banner image" className="aspect-[3/1] w-full border-b border-white/10 object-cover" />
                            <img src={avatarImage} alt="Avatar image"
                                className="absolute -bottom-16 left-4 h-32 w-32 rounded-full object-cover shadow-xl ring-4 ring-zinc-950 sm:left-12 md:-bottom-22 md:left-6 md:h-44 md:w-44" />
                        </div>

                        <div className="flex flex-1 flex-col gap-4 px-4 pb-5 pt-18 sm:flex-row sm:gap-6 sm:px-6 md:pt-24">
                            {/* Left column: name, joined date, location and buttons */}
                            <div className="flex shrink-0 flex-col gap-1 sm:w-44 sm:items-center sm:text-center">
                                <p className="max-w-full truncate text-3xl font-bold">{user.user_name}</p>
                                <p className="text-sm text-zinc-400">Joined {joinedDate}</p>
                                {user.user_location &&
                                    <p className="flex max-w-full items-center gap-1 text-sm text-zinc-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                        <span className="truncate">{user.user_location}</span>
                                    </p>}

                                {/* On mobile the two buttons share a row below the name, on bigger screens they are stacked */}
                                {canEdit &&
                                    <div className="mt-3 grid w-full grid-cols-2 gap-2 text-sm whitespace-nowrap sm:flex sm:flex-col">
                                        <Link href="/settings" className="flex items-center justify-center rounded-lg bg-linear-to-r from-green-500 to-lime-500 px-3 py-1 font-medium transition duration-300 hover:from-green-500 hover:to-lime-600">
                                            Settings
                                        </Link>
                                        {/* This button generates a card with the user stats and can be downloaded or shared */}
                                        <ShareCardButton userName={user.user_name} />
                                    </div>}
                            </div>

                            {/* Right column: bio, links and numbers */}
                            <div className="flex min-w-0 flex-1 flex-col gap-3 text-sm">
                                {user.user_bio
                                    ? <p className="text-zinc-200 text-pretty">{user.user_bio}</p>
                                    : <p className="text-zinc-500">No bio yet.</p>}
    
                                {/* Links */}
                                {(user.user_webpage || user.user_steam_url || user.user_x || user.user_twitch) &&
                                    <div className="flex flex-wrap items-center gap-2">
                                        {user.user_webpage &&
                                            <a href={"https://" + user.user_webpage} target="_blank" rel="noopener noreferrer"
                                                className="flex min-w-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-green-500/60 hover:text-green-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                                <span className="truncate">{user.user_webpage}</span>
                                            </a>}
                                        {user.user_steam_url &&
                                            <a href={user.user_steam_url} target="_blank" rel="noopener noreferrer" aria-label="Steam"
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-green-500/60">
                                                <img src="/staticImages/icon_steam.png" alt="Steam icon" className="h-4 w-4" />
                                            </a>}
                                        {user.user_x &&
                                            <a href={user.user_x} target="_blank" rel="noopener noreferrer" aria-label="X"
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-green-500/60">
                                                <img src="/staticImages/icon_x.png" alt="X icon" className="h-4 w-4" />
                                            </a>}
                                        {user.user_twitch &&
                                            <a href={user.user_twitch} target="_blank" rel="noopener noreferrer" aria-label="Twitch"
                                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-green-500/60">
                                                <img src="/staticImages/icon_twitch.png" alt="Twitch icon" className="h-4 w-4" />
                                            </a>}
                                    </div>}
    
                                {/* Numbers */}
                                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                                    <div>
                                        <p className="text-xs font-medium text-zinc-400">Friends</p>
                                        <p className="mt-1 font-semibold leading-tight">{user.friends}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-400">Lists</p>
                                        <p className="mt-1 font-semibold leading-tight">{user.user_lists}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-400">Reviews</p>
                                        <p className="mt-1 font-semibold leading-tight">{userTotalReviews}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats, same order as before: all games + most played / last review / playing + completed */}
                    <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:grid-rows-3">
                        {/* All games - widget */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg flex flex-col justify-between p-4">
                            <p className="text-sm text-zinc-400">All games</p>
                            <p className="mt-2 text-5xl font-semibold">{userGameStats.gamesAll}</p>
                        </div>

                        {/* Most played game - widget */}
                        {mostPlayed
                            ? <Link href={`/gamePage/${mostPlayed.game_id}`} className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg group isolate flex items-end p-4">
                                <img src={mostPlayed.game_base_image} alt="" aria-hidden="true"
                                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
                                <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/60 to-black/20" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-zinc-400">Most played</p>
                                    <p className="mt-1 line-clamp-2 font-semibold leading-tight group-hover:text-green-400">{mostPlayed.game_name}</p>
                                    <p className="text-sm text-zinc-400">{mostPlayed.hours_played ?? 0} h played</p>
                                </div>
                            </Link>
                            : <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg flex flex-col justify-between p-4">
                                <p className="text-sm text-zinc-400">Most played</p>
                                <p className="text-sm text-zinc-400">No played games yet...</p>
                            </div>}

                        {/* Last review - widget */}
                        {lastReview
                            ? <Link href={`/review/${lastReview.review_id}?from=profile`} className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg group isolate col-span-2 flex items-center gap-4 p-4">
                                <div className="absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-xl transition-transform duration-500 group-hover:scale-125"
                                    style={{ backgroundImage: `url(${lastReview.game_base_image})` }} />
                                <div className="absolute inset-0 -z-10 bg-black/60" />
                                <img src={lastReview.game_base_image} className="h-24 w-18 shrink-0 rounded-lg object-cover shadow-lg ring-1 ring-white/10" alt="Game reviewed" />
                                <div className="min-w-0">
                                    <p className="text-sm text-zinc-400">Last review</p>
                                    <p className="mt-1 truncate font-semibold group-hover:text-green-400">{lastReview.game_name}</p>
                                    <p className="mt-1 line-clamp-2 text-sm text-zinc-300">{lastReview.body}</p>
                                </div>
                            </Link>
                            : <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg col-span-2 flex flex-col justify-between p-4">
                                <p className="text-sm text-zinc-400">Last review</p>
                                <p className="text-sm text-zinc-400">No reviews yet...</p>
                            </div>}

                        {/* Games playing - widget */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg flex flex-col justify-between p-4">
                            <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl" />
                            <p className="text-sm text-zinc-400">Playing</p>
                            <p className="mt-2 text-5xl font-semibold text-blue-400">{userGameStats.gamesPlaying}</p>
                        </div>

                        {/* Completed games - widget */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg flex flex-col justify-between p-4">
                            <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-500/15 blur-2xl" />
                            <p className="text-sm text-zinc-400">Completed</p>
                            <p className="mt-2 text-5xl font-semibold text-green-400">{userGameStats.gamesCompleted}</p>
                        </div>
                    </div>

                    {/* Fav games */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg p-4 lg:col-span-7">
                        <p className="mb-3 flex items-center gap-1.5 text-sm text-zinc-400">
                            <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="h-4 w-4" />
                            Favourite games
                        </p>
                        <FavouriteGames favouriteGames={favouriteGames} canEdit={canEdit} />
                    </div>

                    {/* Activity */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-lg flex flex-col p-4 lg:col-span-5">
                        <div className="mb-3 flex items-center gap-1.5 text-sm text-zinc-400">
                            <img src="/staticImages/icon_activity_gray.png" alt="Activity icon" className="h-4 w-4" />
                            <p>Activity</p>
                            <Link href={`/profile/${params.userName}/activity`} className="ml-auto text-green-500 hover:text-green-400">See all</Link>
                        </div>
                        <div className="max-h-56 overflow-y-auto no-scrollbar">
                            <ActivityWidget userActivity={userActivity} canEdit={canEdit} />
                        </div>
                    </div>

                    {/* Featured lists */}
                    <div className="lg:col-span-12">
                        <p className="mb-3 mt-3 flex items-center gap-1.5 pl-1 text-sm text-zinc-400">
                            <img src="/staticImages/icon_list.png" alt="List icon" className="h-5 w-5" />
                            Featured lists
                        </p>
                        {userLists.length > 0
                            ? <div className="grid gap-3 md:grid-cols-3">
                                <ListsGrid userLists={userLists} />
                            </div>
                            : <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-zinc-400">
                                {canEdit
                                    ? <p>Mark a list as featured in <Link href="/mylists" className="text-green-500 hover:text-green-400">My lists</Link> to show it here.</p>
                                    : <p>No featured lists yet.</p>}
                            </div>}
                    </div>
                </div>
            </div>
        </section>
    )
}
