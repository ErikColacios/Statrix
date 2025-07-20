import React from 'react'
import getGameInfo from "@/app/actions/getGameInfo"
import InputHoursPlayed from '@/app/components/InputHoursPlayed'
import SelectScoreScroll from '@/app/components/SelectScoreRange'
import getUserVideogame from '@/app/actions/getUserVideogame'
import { getSession } from '@/app/actions/getSession'
import Link from 'next/link'
import getGlobalUserVideogame from '@/app/actions/getGlobalUserVideogame'
import { Status } from '@/app/enums/Status'
import UpdateUserVideogameButton from '@/app/components/UpdateUserVideogameButton'

export default async function gamePage({ params }: { params: { listId: string, gameId: string } }) {

    const session = await getSession()
    const user_id: string | undefined = session.user_id

    let gameInfo: any[] = await getGameInfo(params.gameId)

    let userVideogame: any[] = await getUserVideogame(user_id, params.gameId)

    let globalStats: any[] = await getGlobalUserVideogame(params.gameId)

    let imagen: string = ""
    gameInfo.map((item: any) => {
        imagen = `https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`;
    }
    )

    return (
        gameInfo.map((item: any, index: number) => (
            <section style={{ backgroundImage: `url(${imagen})` }} className="relative w-full 2xl:h-screen text-white text-sm bg-center bg-cover " key={index} >
                <div className='bg-black/60 w-full h-full absolute backdrop-blur-md'></div>
                <div className='p-4 md:p-20'>
                    {/* MY LISTS */}
                    <Link href="../mylists" className="group absolute z-50 top-20 flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-40 rounded">
                        <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
                        MY LISTS
                    </Link>
                    <div className="bg-black border mt-12">
                        <div className="flex flex-col lg:flex-row">
                            <div className="flex lg:flex-col border blur-none">
                                <div className='w-72 lg:w-96 blur-none'>
                                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} alt="Videogame cover" className="w-full" />
                                </div>
                                <div className='flex items-center justify-center space-x-8 p-3'>
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
                            </div>

                            <div className="flex flex-col lg:flex-row blur-none">
                                <div className="w-full sm:w-3/3 border flex flex-col relative p-4">
                                    <p className="text-2xl font-bold mb-2">{item.name}</p>
                                    <div className='flex space-x-12'>
                                        <div className="flex flex-col space-y-1">
                                            <div className='text-sm'>
                                                <span className="text-green-400 mr-2">Release date: </span> <span>{item.release_dates[0] ? item.release_dates[0].human : "Uknown"}</span>
                                            </div>
                                            <div className='text-sm'>
                                                <span className="text-green-400 mr-2">Developer: </span><span>{item.involved_companies[0] ? item.involved_companies[0].company.name : "-"}</span>
                                            </div>
                                            <div className='text-sm'>
                                                <span className="text-green-400 mr-2">Editor: </span>
                                                <span>{item.involved_companies[1] ? item.involved_companies[1].company.name : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <div className='text-sm'>
                                                <span className="text-green-400 mr-2">General rating: </span><span>{item.rating ? Math.trunc(item.rating) : "-"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-sm mt-1'>
                                        <span className="text-green-400 mr-2">Genres: </span>
                                        {item.genres?.map((g: any) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded text-gray-200'>{g.name}</span>
                                        ))}
                                    </div>

                                    <p className='text-sm sm:text-sm mt-2'>{item.summary}</p>
                                </div>
                                <div className='grid grid-cols-1 mt-12 sm:grid-cols-2 2xl:absolute bottom-0'>
                                    <img src={item.screenshots ? `https://images.igdb.com/igdb/image/upload/t_720p/${item.screenshots[0].image_id}.png` : ""} className='sm:h-72' alt="Screenshot" />
                                    <img src={item.screenshots[1] ? `https://images.igdb.com/igdb/image/upload/t_720p/${item.screenshots[1].image_id}.png` : ""} className='sm:h-72' alt="Screenshot" />
                                </div>
                            </div>

                            <aside className="flex flex-col w-full p-4 border blur-none">
                                <p className='text-xl'>{session.user_name} status</p>
                                <div className='flex flex-col space-y-4 text-base'>
                                    <select className='bg-black border border-gray-500 outline-none focus:border-green-500 mt-2 p-2 rounded' id='status' defaultValue={userVideogame[0].status}>
                                        <option value={Status.PLAYING}>{Status.PLAYING}</option>
                                        <option value={Status.COMPLETED}>{Status.COMPLETED}</option>
                                        <option value={Status.ON_HOLD}>{Status.ON_HOLD}</option>
                                        <option value={Status.DROPPED}>{Status.DROPPED}</option>
                                    </select>
                                    <SelectScoreScroll score={userVideogame[0].score} videogame_id={item.id} />
                                    <div className='flex'>
                                        <span className='mr-4'>Hours played </span>
                                        <InputHoursPlayed hours_played={userVideogame[0].hours_played} videogame_id={item.id} source='gamePage' />
                                    </div>
                                </div>
                                <UpdateUserVideogameButton gameId={params.gameId} />
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        )
        )
    )
}

