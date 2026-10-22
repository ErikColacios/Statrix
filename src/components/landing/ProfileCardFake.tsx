import React from 'react'
import { ListMode } from '@/enums/ListMode'

// Static copy of the profile page (/profile/[userName]) filled with fake data, used in the home page
export default function ProfileCardFake({ profile }: any) {

    return (
        <div className="flex flex-col text-white">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-4 lg:flex-row">
                <div className="h-full flex flex-col md:h-120 lg:w-1/2 rounded-lg border border-white/10 bg-zinc-900/40 backdrop-blur-lg">
                    {/* Profile - widget */}
                    <div className="relative h-38 md:h-70 z-10">
                        <img src={profile.bannerImage} alt="Banner image" className="rounded-t-lg border-b border-white/10 w-full h-30 sm:h-62 object-cover" />
                        <div className="w-28 h-28 md:w-36 md:h-36 xl:w-44 xl:h-44 border border-white/10 rounded-full overflow-hidden ml-4 sm:ml-6 md:ml-2 absolute bottom-0 sm:bottom-5">
                            <img src={profile.avatarImage} className="h-full w-full object-cover" alt="Avatar image" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row px-4 sm:px-2 py-4">
                        <div className="flex flex-col space-y-2 sm:items-center text-sm xl:px-4">
                            <p className="text-4xl font-bold">{profile.userName}</p>
                            <p className="text-gray-400">Joined {profile.creationDate}</p>
                            <div className="hidden sm:flex flex-col space-y-2 w-full">
                                <span className="flex items-center justify-center space-x-2 px-3 py-1 rounded-lg bg-linear-to-r from-green-500 to-lime-500 cursor-pointer">
                                    <span>Settings</span>
                                </span>
                                <span className="flex items-center justify-center space-x-2 px-3 py-1 rounded-lg border border-green-500 text-green-400 cursor-pointer">
                                    <img src="/staticImages/icon_share.png" alt="Share icon" className="w-4" />
                                    <span>Share card</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 text-sm sm:w-2/3 mt-4 sm:ml-4 sm:mt-0">
                            <p>{profile.bio}</p>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                                    <b className="ml-1">{profile.webpage}</b>
                                </div>
                                <img src="/staticImages/icon_steam.png" alt="Steam icon" className="w-4 h-4" />
                                <img src="/staticImages/icon_x.png" alt="X icon" className="w-4 h-4" />
                                <img src="/staticImages/icon_twitch.png" alt="Twitch icon" className="w-4 h-4" />
                            </div>

                            <div className="flex text-sm space-x-8 mt-2">
                                <div className="flex flex-col w-24 overflow-hidden">
                                    <p className="text-gray-400">Location</p>
                                    <p>{profile.location}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-400">Friends</p>
                                    <p>{profile.friends}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-400">Lists</p>
                                    <p>{profile.lists}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-400">Reviews</p>
                                    <p>{profile.reviews}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 md:h-120 w-full lg:w-1/2 z-10">
                    <div className="flex space-x-4 h-1/3">
                        {/* All games - widget*/}
                        <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-lg">
                            <p className="text-green-600">All games</p>
                            <p className="mt-1 text-6xl font-bold">{profile.stats.gamesAll}</p>
                        </div>
                        {/* Most played game - widget*/}
                        <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-lg">
                            <p className="text-green-600">Most played game</p>
                            <p className="text-xl sm:text-3xl font-bold mt-1">{profile.stats.mostPlayed}</p>
                        </div>
                    </div>
                    {/* Last review - widget*/}
                    <div className="flex space-x-4 border border-white/10 bg-zinc-900/40 backdrop-blur-lg rounded-lg overflow-hidden h-1/3">
                        <div className="relative isolate w-full flex items-center p-4">
                            <div className="absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-xl"
                                style={{ backgroundImage: `url(${profile.lastReview.gameImage})` }} />
                            <div className="absolute w-full inset-0 bg-black/60" />
                            <img src={profile.lastReview.gameImage} className="w-20 h-24 z-10 mr-3" alt="Game reviewed" />
                            <div className="flex flex-col z-10">
                                <p className="text-green-400 font-bold">Last review <span className="text-white ml-1">{profile.lastReview.gameName}</span></p>
                                <p className="text-sm mt-1 max-h-20 overflow-hidden">{profile.lastReview.body}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-4 h-1/3">
                        {/* Games playing - widget*/}
                        <div className="relative w-full overflow-hidden rounded-lg p-4 border border-white/10 bg-zinc-900/40 backdrop-blur-lg">
                            <p className="text-green-600">Games playing</p>
                            <p className="text-6xl font-bold mt-1">{profile.stats.gamesPlaying}</p>
                        </div>
                        {/* Completed games - widget*/}
                        <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-lg">
                            <p className="text-green-600">Completed games</p>
                            <p className="text-6xl font-bold mt-1">{profile.stats.gamesCompleted}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 w-full z-10">
                {/* Fav games */}
                <div className="flex flex-col md:w-1/2">
                    <p className="flex items-center mt-4 mb-2 text-base text-gray-400 pl-1">
                        <img src="/staticImages/icon_star_gray.png" alt="Star icon" className="w-4 h-4 mr-1" />
                        Favourite games</p>
                    <section className="grid grid-cols-5 gap-2 px-1">
                        {profile.favouriteGames.map((game: any, index: number) => (
                            <div key={index} className='relative group'>
                                <div className="flex justify-center items-center rounded-lg overflow-hidden">
                                    <img src={game.gameImage} className='w-full aspect-[3/4] object-cover transition duration-300 group-hover:blur-xs group-hover:brightness-50' alt={'Game cover'} />
                                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                        <p className="text-xs">{game.gameName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Activity */}
                <div className="flex flex-col md:w-1/2">
                    <div className="flex items-center mt-4 mb-2 text-base text-gray-400 pl-1">
                        <img src="/staticImages/icon_activity_gray.png" alt="Activity icon" className="w-4 h-4 mr-1" />
                        <p>Activity</p>
                        <span className="ml-auto text-green-500">See all</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {profile.activity.map((activity: any, index: number) => (
                            <div className='w-full flex items-center border border-white/10 bg-zinc-900/40 backdrop-blur-lg overflow-hidden rounded-lg text-white text-sm' key={index}>
                                <img src={activity.gameImage} className="w-12 h-14 object-cover" alt="Game cover" />
                                <div className="flex flex-col items-start pl-4 w-4/5">
                                    <div className="flex space-x-2">
                                        <p className="font-bold">{profile.userName}</p>
                                        <p className="text-gray-400">{activity.action}</p>
                                    </div>
                                    <p className="font-bold">{activity.gameName}</p>
                                </div>
                                <p className="text-gray-400 w-1/5 pr-2">{activity.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured lists */}
            <p className="flex items-center mt-4 mb-1 text-base text-gray-400 z-10">
                <img src="/staticImages/icon_list.png" alt="List icon" className="w-5 h-5 mr-1" />
                Featured lists</p>
            <div className="grid md:grid-cols-3 gap-2">
                {profile.featuredLists.map((list: any, index: number) => (
                    <div key={index} className='flex flex-col bg-zinc-900/70 border border-white/10 backdrop-blur-lg hover:bg-zinc-800 hover:border-green-500 rounded-2xl overflow-hidden mb-4 md:mb-0'>
                        <div className='relative flex w-full h-48 bg-black'>
                            {list.covers.map((cover: any, i: number) => (
                                <img key={i} src={cover.gameBaseImage} className='absolute w-36 h-48 rounded-tr-xl border border-gray-600'
                                    style={{ left: `${i * 20}%`, zIndex: list.covers.length * 10 - (i * 10) }}
                                    alt='Cover image' />
                            ))}
                        </div>
                        <div className='flex items-center p-6'>
                            <div className='flex flex-col w-full'>
                                <p className="text-2xl text-gray-200">{list.listName}</p>
                                <div className="flex items-center text-sm text-gray-400 pt-2">
                                    <p>Games: {list.listGames}</p>
                                    <span className={`${list.listMode === ListMode.UNRANKED ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"} ml-4 px-2 py-1 mt-1 text-xs rounded`}>
                                        {list.listMode}
                                    </span>
                                    <p className="ml-auto">{list.listCreationDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
