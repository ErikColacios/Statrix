"use server"
import React from 'react'
import { Game } from '@/types/Game';
import getGameInfo from '@/actions/getGameInfo';
import getGlobalUserVideogame from '@/actions/getGlobalUserVideogame';
import getGameReviews from '@/actions/getGameReviews';
import { ReviewMode } from '@/enums/ReviewMode';
import SliderImages from '@/components/SliderImages';
import ReviewSection from '@/components/ReviewSection';
import AddGame from '@/components/AddGame';
import getSessionUser from '@/actions/getSessionUser';

export default async function gamePage({ params }: { params: { list_id: string, game_id: number } }) {

    const session = await getSessionUser()
    const userId: string | undefined = session?.user.id as string
    let gameInfo: Game[] = await getGameInfo(params.game_id)
    let globalStats: any[] = await getGlobalUserVideogame(params.game_id)
    let gameReviews: any[] = await getGameReviews(params.game_id, ReviewMode.POPULAR)

    return (
        gameInfo.map((game: any, index: number) => (
            <section className="w-full bg-linear-to-b from-black via-gray-900 to-black text-white text-sm py-16" key={index}>
                    <div className='w-full flex flex-col games-center items-center blur-none'>
                        {/* Game box */}
                        <div className='w-full lg:w-2/3 lg:w-2/3 3xl:w-1/2 bg-black/80 mt-8 rounded-sm'>
                            <div className='relative h-96'>
                                {game.artworks && <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.artworks[0].image_id}.jpg`} className='w-full h-full object-cover' alt='Artwork'/>}
                                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`} className="bottom-[-60px] absolute w-24 sm:w-36 md:w-48 ml-4 rounded-sm" alt='Game cover'/>
                            </div>
                            <div className='flex flex-col md:flex-row'>
                                <div className='relative text-sm md:w-2/3 pl-4'>
                                    <div className='absolute right-10 flex games-center space-x-8 pt-6'>
                                        {/* Played by x users */}
                                        <div className='tooltip'>
                                            <svg width="18px" height="18px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>game_controller [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -4679.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M342,4527 L326,4527 L326,4537 L330,4537 L330,4535 L338,4535 L338,4537 L342,4537 L342,4527 Z M344,4525 L344,4527 L344,4537 L344,4539 L336,4539 L336,4537 L332,4537 L332,4539 L324,4539 L324,4537 L324,4527 L324,4525 L326,4525 L333,4525 L333,4523 L333,4521 L338,4521 L338,4519 L340,4519 L340,4521 L340,4523 L335,4523 L335,4525 L342,4525 L344,4525 Z M336,4529 L336,4531 L336,4533 L340,4533 L340,4531 L340,4529 L336,4529 Z M328,4529 L332,4529 L332,4531 L332,4533 L328,4533 L328,4531 L328,4529 Z" id="game_controller-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                            <p className='ml-2 text-green-500'>{globalStats[0]}</p>
                                            <span className="tooltiptext">{globalStats[0]} users playing</span>
                                        </div>
                                        {/* Is in list of x users */}
                                        <div className='tooltip'>
                                            <svg width="18px" height="18px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 1H1V3H3V1Z" fill="#ffffff"></path> <path d="M3 5H1V7H3V5Z" fill="#ffffff"></path> <path d="M1 9H3V11H1V9Z" fill="#ffffff"></path> <path d="M3 13H1V15H3V13Z" fill="#ffffff"></path> <path d="M15 1H5V3H15V1Z" fill="#ffffff"></path> <path d="M15 5H5V7H15V5Z" fill="#ffffff"></path> <path d="M5 9H15V11H5V9Z" fill="#ffffff"></path> <path d="M15 13H5V15H15V13Z" fill="#ffffff"></path> </g></svg>
                                            <p className='ml-2 text-green-500'>{globalStats[1]}</p>
                                            <span className="tooltiptext">Completed by {globalStats[1]} users</span>
                                        </div>
                                        {/* Starred by x users */}
                                        <div className='tooltip'>
                                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                            <p className='ml-2 text-green-500'>{globalStats[2]}</p>
                                            <span className="tooltiptext">Starred by {globalStats[2]} users</span>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-20">{game.name}</h2>
                                    <div className="grid grid-cols-2 gap-x-8 lg:w-3/4">
                                        <div>
                                            <span className="text-green-400 mr-2">Release date: </span> <span>{game.release_dates[0] ? game.release_dates[0].human : "Uknown"}</span>
                                        </div>
                                        <div>
                                            <span className="text-green-400 mr-2">General rating: </span><span>{game.rating ? Math.trunc(game.rating) : "-"}</span>
                                        </div>
                                    </div>
                                    <div className='text-sm mt-2'>
                                        <span className="text-green-400 mr-2">Genres: </span>
                                        {game.genres?.map((g: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded-sm text-gray-200' key={index}>{g.name}</span>
                                        ))}
                                    </div>

                                    <div className='text-sm mt-2'>
                                        <span className="text-green-400 mr-2">Developers: </span>
                                        {game.involved_companies?.map((c: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded-sm text-gray-200' key={index}>{c.company.name}</span>
                                        ))}
                                    </div>

                                    <p className='mt-6'>{game.summary}</p>
                                </div>

                                {/* User Videogame panel component */}
                                {userId &&
                                    <aside className='md:w-2/6 p-4'>
                                        <AddGame game={gameInfo[0]}/>
                                    </aside>
                                }
                            </div>

                            {/* Slider of images component */}
                            <SliderImages screenshots={game.screenshots} />

                            {/* Review list component*/}
                            <ReviewSection gameReviews={gameReviews} gameId={params.game_id} gameName={game.name} coverImageId={game.cover.image_id} />
                        </div>
                    </div>
            </section>
        )
        )
    )
}