"use server"
import React from 'react'
import getGameInfo from '@/actions/getGameInfo';
import getGlobalUserVideogame from '@/actions/getGlobalUserVideogame';
import getGameReviews from '@/actions/getGameReviews';
import { ReviewMode } from '@/enums/ReviewMode';
import SliderImages from '@/components/SliderImages';
import ReviewSection from '@/components/ReviewSection';
import AddGame from '@/components/AddGame';
import getSessionUser from '@/actions/getSessionUser';
import { GameIGDB } from '@/types/GameIGDB';

export default async function gamePage({ params }: { params: { list_id: string, game_id: number } }) {

    const session = await getSessionUser()
    const userId: string | undefined = session?.user.id as string
    let gameInfo: GameIGDB[] = await getGameInfo(params.game_id)
    let globalStats: any[] = await getGlobalUserVideogame(params.game_id)
    let gameReviews: any[] = await getGameReviews(params.game_id, ReviewMode.POPULAR)

    return (
        gameInfo.map((game: any, index: number) => (
            <section className="w-full bg-linear-to-b from-black via-gray-900 to-black text-white py-16" key={index}>
                <div className='w-full flex flex-col games-center items-center blur-none'>
                    {/* Game box */}
                    <div className='w-full lg:w-2/3 lg:w-2/3 3xl:w-1/2 bg-black/80 mt-8 rounded-sm'>
                        <div className='relative h-96'>
                            {game.artworks && <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id}.jpg`} className='w-full h-full object-cover' alt='Artwork' />}
                            <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`} className="bottom-[-60px] absolute z-50 w-24 sm:w-36 md:w-48 ml-4 rounded-sm" alt='Game cover' />
                            <div className="pointer-events-none absolute inset-y-0 bottom-0 w-full h-full bg-gradient-to-t from-black to-transparent z-5" />
                        </div>


                        {/* Game Info */}
                        <section className='flex flex-col md:flex-row px-4 pt-20'>
                            <div className='flex flex-col'>
                                <h2 className="mb-4 text-3xl md:text-4xl font-bold">{game.name}</h2>

                                <div className='flex flex-col'>
                                    <div className='flex'><span className="text-green-400 mr-2">Release date: </span> <span>{game.release_dates[0] ? game.release_dates[0].human : "Uknown"}</span></div>
                                    <div className='mt-2'>
                                        <span className="text-green-400 mr-2">Genres:</span>
                                        {game.genres?.map((g: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded-sm text-gray-200' key={index}>{g.name}</span>
                                        ))}
                                    </div>
                                    <div className='mt-2'>
                                        <span className="text-green-400 mr-2">Developers:</span>
                                        {game.involved_companies?.map((c: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded-sm text-gray-200' key={index}>{c.company.name}</span>
                                        ))}
                                    </div>
                                    <div className='mt-2'>
                                        <span className="text-green-400 mr-2">Platforms:</span>
                                        {game.platforms?.map((p: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded-sm text-gray-200' key={index}>{p.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Global stats */}
                            <aside className='flex flex-col md:ml-auto mt-10 md:mt-0'>
                                <p className="text-right text-gray-200 mb-2">Global stats</p>
                                <span className="w-full bg-zinc-600 h-px mb-2"></span>
                                <div className='flex space-x-8'>
                                    <div className="text-right">
                                        <p className='text-sm'>General rating</p>
                                        <p className={`p-4 rounded-lg bg-radial text-6xl font-bold
                                            ${game.rating >= 70 ? " from-green-500 from-50% to-lime-700" : ""}
                                            ${game.rating >= 50 && game.rating < 70 ? " from-yellow-500 from-50% to-orange-600" : ""}
                                            ${game.rating < 50 ? " from-red-500 from-50% to-rose-700" : ""}
                                            `}>
                                            {game.rating ? Math.trunc(game.rating) : "-"}</p>
                                    </div>
                                    <div className='w-full grid grid-cols-2 gap-3 md:w-84'>
                                        <div className="border-l-2 border-green-500 bg-zinc-900 pl-2 rounded-r-lg">
                                            <p className="">Playing</p>
                                            <p className="text-xl font-bold mt-1">{globalStats[0]}</p>
                                        </div>
                                        <div className="border-l-2 border-cyan-600 bg-zinc-900 pl-2 rounded-r-lg">
                                            <p className="">Completed</p>
                                            <p className="text-xl font-bold mt-1">{globalStats[1]}</p>
                                        </div>
                                        <div className="border-l-2 border-red-600 bg-zinc-900 pl-2 rounded-r-lg">
                                            <p className="">Dropped</p>
                                            <p className="text-xl font-bold mt-1">{globalStats[2]}</p>
                                        </div>
                                        <div className="border-l-2 border-amber-600 bg-zinc-900 pl-2 rounded-r-lg">
                                            <p className="">Starred</p>
                                            <p className="text-xl font-bold mt-1">{globalStats[3]}</p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </section>


                        <section className='md:grid md:grid-cols-5 gap-4 2xl:gap-12 px-4 mt-8'>
                            <p className='col-span-3 mt-6'>{game.summary}</p>
                            {/* If user is logged in, show the AddGame component */}
                            {userId &&
                                <aside className='mt-12 md:mt-0 md:col-span-2 ml-auto'>
                                    <AddGame game={gameInfo[0]} />
                                </aside>
                            }
                        </section>


                        {/* Slider of images component */}
                        {game.screenshots && <SliderImages screenshots={game.screenshots} />}

                        {/* Review list component*/}
                        <ReviewSection gameReviews={gameReviews} gameId={params.game_id} gameName={game.name} coverImageId={game.cover.image_id} />
                    </div>
                </div>
            </section>
        )
        )
    )
}