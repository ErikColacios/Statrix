import React from 'react'

export default function ProfileCardFake() {
    return (
            <div className="">
                <section className="flex space-y-4 lg:space-y-0 lg:space-x-4 flex-row">

                    {/* 1st half */}
                    <div className="h-full flex flex-col md:h-110 lg:w-2/3 xl:w-140 rounded-lg border border-white/10 bg-zinc-900/40 backdrop-blur-lg">
                        <div className="relative h-38 md:h-70 z-10">
                            <img src={`/bannerImages/night_city.jpg`}
                                alt="Banner image"
                                className="rounded-t-lg border-b border-white/10 w-full sm:h-62"/>
                            <div className="w-28 h-28 md:w-36 md:h-36 xl:w-48 xl:h-48 border border-white/10 rounded-full overflow-hidden ml-4 sm:ml-6 md:ml-2 absolute bottom-0 sm:bottom-5">
                                <img src={'/avatarImages/sonic.jpg'} className="h-full w-full object-cover" alt="Avatar image" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row px-4 sm:px-2 py-4">
                            <div className="flex flex-col space-y-2 sm:items-center text-sm xl:px-4">
                                <div className="flex items-center space-x-2">
                                    <p className="text-4xl font-bold">MiaXx</p>
                                </div>
                                <p className="text-gray-400">Joined 20/10/2026</p>
                            </div>
                            <div className="flex flex-col space-y-2 text-sm sm:w-2/3 mt-4 sm:ml-4 sm:mt-0">
                                <p>Welcome to my profile!!</p>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-1">
                                        <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g> <g id="SVGRepo_iconCarrier">{' '}
                                                <path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955"
                                            stroke="#ffffff"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                ></path>{' '}
                                            </g>
                                        </svg>
                                        <b>www.mywebsite.com</b>
                                    </div>
                                    <img src="/staticImages/icon_steam.png" alt="Steam icon" className="w-4 h-4" />
                                    <img src="/staticImages/icon_x.png" alt="X icon" className="w-4 h-4" />
                                    <img src="/staticImages/icon_twitch.png" alt="Twitch icon" className="w-4 h-4" />
                                </div>
                                <div className="flex text-sm space-x-8 mt-2">
                                    <div className="flex flex-col w-24 overflow-hidden">
                                        <p className="text-gray-400">Location</p>
                                        <p>Barcelona</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-gray-400">Friends</p>
                                        <p>32</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-gray-400">Lists</p>
                                        <p>4</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-gray-400">Reviews</p>
                                        <p>12</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd half */}
                    <div className="flex flex-col space-y-4 md:h-110 w-full lg:w-2/3 xl:w-120 z-10">
                        <div className="flex space-x-4 h-1/3">
                            {/* All games - widget*/}
                            <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-lg">
                                <p className="text-green-600">All games</p>
                                <p className="mt-1 text-6xl font-bold">180</p>
                            </div>
                            {/* Most played game - widget*/}
                            <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-lg">
                                <p className="text-green-600">Most played game</p>
                                <p className="text-xl sm:text-3xl font-bold mt-1">Elden Ring</p>
                            </div>
                        </div>
                        {/* Last review - widget*/}
                        <div className="flex space-x-4 border border-white/10 bg-zinc-900/40 backdrop-blur-lg rounded-lg overflow-hidden h-1/3">
                            <div className="relative isolate w-full flex items-center p-4">
                                <div className="absolute inset-0 -z-20 scale-110 bg-cover bg-center blur-xl transition-transform duration-500 group-hover:scale-125"
                                    style={{ backgroundImage: `url(/staticImages/gameCovers/resident_evil_requiem.jpg)` }}/>

                                <div className="absolute w-full inset-0 bg-black/60" />
                                <img
                                    src={'/staticImages/gameCovers/resident_evil_requiem.jpg'}
                                    className="w-20 h-24 z-10 mr-3"
                                    alt="Game reviewed"/>
                                <div className="flex flex-col z-10">
                                    <p className="text-green-400 font-bold">
                                        Last review <span className="text-white ml-1">Resident Evil: Requiem</span>
                                    </p>
                                    <p className="text-sm mt-1 max-h-20 overflow-hidden">This game is awesome</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-4 h-1/3">
                            {/* Games playing - widget*/}
                            <div className="relative w-full overflow-hidden rounded-lg p-4 border border-white/10 bg-zinc-900/40 backdrop-blur-lg">
                                <p className="text-green-600">Games playing</p>
                                <p className="text-6xl font-bold mt-1">8</p>
                            </div>
                            {/* Completed games - widget*/}
                            <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-lg">
                                <p className="text-green-600">Completed games</p>
                                <p className="text-6xl font-bold mt-1">34</p>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    )
}
