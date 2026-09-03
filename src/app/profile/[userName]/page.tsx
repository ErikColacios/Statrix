import React from "react";
import getUserGameReviews from "@/actions/getUserGameReviews";
import getUserGameStats from "@/actions/getUserGameStats";
import getUserInfo from "@/actions/getUserInfo";
import { getUserTotalHoursPlayed } from "@/actions/getUserTotalHoursPlayed";
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

export default async function Profile({ params }: { params: { userName: string } }) {

    const session: any = await getSessionUser()

    let userInfo: any | undefined = []
    let userGameStats: any | undefined = []
    let userTotalHoursPlayed: number | undefined
    let userTotalReviews: number | undefined
    let userReviews: any | undefined = []
    let canEdit: boolean = false
    let favouriteGames: Game[] = []
    let userActivity: Activity[] = []
    let userLists: List[] = []

    if (session?.user.isNewUser) {
        redirect("/newUser")
    }

    userInfo = await getUserInfo(params.userName)

    if (userInfo.length == 0) { redirect("/") }
    if (params.userName == session?.user?.name) canEdit = true

    userGameStats = await getUserGameStats(params.userName)
    userTotalHoursPlayed = await getUserTotalHoursPlayed(params.userName)
    userTotalReviews = await getUserTotalReviews(params.userName)
    userReviews = await getUserGameReviews(params.userName)
    favouriteGames = await getUserFavouriteGames(params.userName)
    userActivity = (await getUserActivity(params.userName)).slice(0, 5)
    userLists = (await getListsUser(userInfo[0].user_id, true)).slice(0, 3) // We show only the top 3 featured lists

    return (
        <>
            {userInfo.map((item: any, index: number) => (
                <section className="min-h-screen bg-black text-white py-16 flex flex-col items-center p-2" key={index}>
                    <div className="flex flex-col">
                        <div className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-4 lg:flex-row">
                            <div className="h-full flex flex-col md:h-120 lg:w-2/3 xl:w-160 border border-gray-600 bg-zinc-900 rounded-lg" >
                                {/* Profile - widget */}
                                <div className="relative h-38 md:h-70 z-10">
                                    <img src={"/bannerImages/" + item.banner_image} alt="Banner image" className="rounded-t-lg border-b border-gray-600 sm:w-full sm:h-62" />
                                    <div className="w-28 h-28 md:w-36 md:h-36 xl:w-48 xl:h-48 rounded-full overflow-hidden ml-4 sm:ml-6 md:ml-2 absolute bottom-5">
                                        <img src={"/avatarImages/" + item.avatar_image} className="h-full w-full object-cover" alt="Avatar image" />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row px-5 py-4">
                                    <div className="flex flex-col space-y-2 sm:items-center text-sm xl:px-4">
                                        <p className="text-4xl font-bold">{item.user_name.slice(0, 10)}</p>
                                        <p className="text-gray-400">Joined {item.user_creationdate.toISOString().split('T')[0]}</p>
                                        {canEdit && <Link href={'/settings'} className="w-1/2 sm:w-full text-center text-md text-white px-3 py-1 sm:px-6 sm:py-1 rounded-xl 
                                bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                                            Settings</Link>}
                                    </div>
                                    <div className="flex flex-col space-y-2 text-sm sm:w-2/3 mt-4 sm:ml-4 sm:mt-0">
                                        <p className="">{item.user_bio}</p>
                                        <div className="flex items-center space-x-6">
                                            {item.user_webpage && (
                                                <div className="flex items-center">
                                                    <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                                                    <b><a className="hover:text-green-500 ml-1" href={"https://" + item.user_webpage} target="_blank" rel="noopener noreferrer">{item.user_webpage}</a></b>
                                                </div>
                                            )}
                                            {item.user_steam && (
                                                <a className="" href={item.user_steam} target="_blank" rel="noopener noreferrer">
                                                    <img src="/staticImages/icon_steam.png" alt="Steam icon" className="w-4 h-4" />
                                                </a>
                                            )}
                                            {item.user_x && (
                                                <a className="" href={item.user_x} target="_blank" rel="noopener noreferrer">
                                                    <img src="/staticImages/icon_x.png" alt="X icon" className="w-4 h-4" />
                                                </a>
                                            )}
                                            {item.user_twitch && (
                                                <a className="" href={item.user_twitch} target="_blank" rel="noopener noreferrer">
                                                    <img src="/staticImages/icon_twitch.png" alt="Twitch icon" className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex text-sm space-x-8 mt-2">
                                            <div className="flex flex-col w-24 overflow-hidden">
                                                <p className="text-gray-400">Location</p>
                                                <p>{item.user_location}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-gray-400">Friends</p>
                                                <p>{item.friends}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-gray-400">Lists</p>
                                                <p>{item.user_lists}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-gray-400">Reviews</p>
                                                <p>{userTotalReviews}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4 md:h-120 w-full lg:w-2/3 xl:w-160">
                                <div className="flex space-x-4 h-1/3">
                                    {/* Completed games - widget*/}
                                    <div className="w-full overflow-hidden border border-gray-600 bg-zinc-900 rounded-lg p-4">
                                        <p className="text-green-600">Completed games</p>
                                        <p className="text-6xl font-bold mt-1">{userGameStats.gamesCompleted}</p>
                                    </div>
                                    {/* Most played game - widget*/}
                                    <div className="w-full overflow-hidden border border-gray-600 bg-zinc-900 rounded-lg p-4">
                                        <p className="text-green-600">Most played game</p>
                                        <p className="text-xl sm:text-3xl font-bold mt-1">{userGameStats.topGames[0] ? userGameStats.topGames[0].game_name : "No played games yet..."}</p>
                                    </div>
                                </div>
                                {/* Last review - widget*/}
                                <div className="flex space-x-4 border border-gray-600 bg-zinc-900 rounded-lg overflow-hidden h-1/3">
                                    {userReviews.map((r: any, index: number) => (
                                        <Link href={'/gamePage/' + r.videogame_id} className="relative w-full flex items-center bg-cover bg-center p-4 transition hover:opacity-70"
                                            style={{ backgroundImage: `url(${r.game_base_image})` }}
                                            key={index}>
                                            <div className="absolute w-full inset-0 bg-black/60 " />
                                            <img src={r.game_base_image} className="w-20 h-24 z-10 mr-3" alt="Game reviewed" />
                                            <div className="flex flex-col z-10">
                                                <p className="text-green-400 font-bold">Last review <span className="text-white ml-1">{r.videogame_name}</span></p>
                                                <p className="text-sm mt-1">{r.body}</p>
                                            </div>
                                        </Link>
                                    ))}
                                    {userReviews == 0 &&
                                        <div className="flex flex-col p-4">
                                            <p className="text-green-600">Last review</p>
                                            <p>No reviews yet...</p>
                                        </div>}
                                </div>
                                <div className="flex space-x-4 h-1/3">
                                    {/* Games playing - widget*/}
                                    <div className="w-full overflow-hidden border border-gray-600 bg-zinc-900 rounded-lg p-4">
                                        <p className="text-green-600">Games playing</p>
                                        <p className="text-6xl font-bold mt-1">{userGameStats.gamesPlayed}</p>
                                    </div>
                                    {/* Hours played - widget*/}
                                    <div className="w-full overflow-hidden border border-gray-600 bg-zinc-900 rounded-lg p-4 max-w-72">
                                        <p className="text-green-600">Hours played</p>
                                        <p className="text-6xl font-bold mt-1">{userTotalHoursPlayed}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                            {/* Fav games */}
                            <div className="flex flex-col sm:w-1/2">
                                <p className="flex items-center mt-4 mb-2 text-base text-zinc-400 pl-1">
                                    <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-4 h-4 mr-1" />
                                    Favourite games</p>
                                <FavouriteGames favouriteGames={favouriteGames} canEdit={canEdit}/>
                            </div>


                            {/* Activity */}
                            <div className="flex flex-col sm:w-1/2">
                                <div className="flex items-center mt-4 mb-2 text-base text-zinc-400 pl-1">
                                    <img src="/staticImages/icon_activity_gray.png" alt="Activity icon" className="w-4 h-4 mr-1" />
                                    <p>Activity</p>
                                    <Link href={`/profile/${params.userName}/activity`} className="ml-auto text-green-500 hover:text-green-600">See all</Link>
                                </div>
                                <div className="sm:h-39 overflow-y-scroll no-scrollbar">
                                    <ActivityWidget userActivity={userActivity} canEdit={canEdit}/>
                                </div>
                            </div>
                        </div>


                        {/* Featured lists */}
                        <p className="flex items-center mt-4 mb-1 text-base text-zinc-400">
                            <img src="/staticImages/icon_list.png" alt="List icon" className="w-5 h-5 mr-1" />
                            Featured lists</p>
                        <div className="grid md:grid-cols-3 gap-2 ">
                            <ListsGrid userLists={userLists} />
                        </div>
                    </div>
                </section>
            ))}
        </>
    )
}