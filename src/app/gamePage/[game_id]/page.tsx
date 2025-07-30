"use server"
import React from 'react'
import getGameInfo from "@/app/actions/getGameInfo"
import InputHoursPlayed from '@/app/components/InputHoursPlayed'
import SelectScoreScroll from '@/app/components/SelectScoreRange'
import getUserVideogame from '@/app/actions/getUserVideogame'
import getGlobalUserVideogame from '@/app/actions/getGlobalUserVideogame'
import { Status } from '@/app/enums/Status'
import UpdateUserVideogameButton from '@/app/components/UpdateUserVideogameButton'
import SliderImages from '@/app/components/SliderImages'
import getGameReviews from '@/app/actions/getGameReviews'
import AcceptButton from '@/app/components/AcceptButton'
import ReviewModal from '@/app/components/ReviewModal'
import { Dialog } from "radix-ui";
import ReviewSelection from '@/app/components/ReviewSection'
import { ReviewMode } from '@/app/enums/ReviewMode'

export default async function gamePage({ params }: { params: { list_id: string, game_id: string } }) {

    let gameInfo: any[] = await getGameInfo(params.game_id)
    let userVideogame: any[] = await getUserVideogame(params.game_id)
    let globalStats: any[] = await getGlobalUserVideogame(params.game_id)
    let gameReviews: any[] = await getGameReviews(params.game_id, ReviewMode.POPULAR)

    let image: string = "";
    gameInfo.map((item: any) => {
        image = `https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`;
    }
    )

    return (
        gameInfo.map((item: any, index: number) => (
            <section style={{ backgroundImage: `url(${image})` }} className="relative w-full h-full text-white text-sm bg-center bg-cover pb-12" key={index}>
                <Dialog.Root>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content className={`fixed w-full p-2 md:w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                            data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                            <Dialog.Title className="DialogTitle"></Dialog.Title>
                            <Dialog.Description className="DialogDescription"></Dialog.Description>
                            <ReviewModal game_id={item.id} game_name={item.name} game_cover={item.cover.image_id} />
                        </Dialog.Content>
                    </Dialog.Portal>


                    <div className='bg-black/60 w-full h-full absolute backdrop-blur-md'></div>
                    <div className='pt-8 w-full h-full flex flex-col items-center justify-center blur-none'>
                        {/* GAME BOX */}
                        <div className='w-full md:w-3/4 2xl:w-1/2 h-full bg-black/80 mt-8 rounded overflow-hidden'>
                            <div className='relative'>
                                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.screenshots[0].image_id}.png`} className='w-full h-80 md:h-96' />
                                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className="bottom-[-60px] absolute w-36 md:w-48 ml-4 rounded" />
                            </div>
                            <div className='flex flex-col md:flex-row'>
                                <div className='relative text-sm md:w-2/3 pl-4'>
                                    <div className='w-full flex items-center justify-end space-x-8 pt-6 pr-4'>
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
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-8">{item.name}</h2>
                                    <div className="grid grid-cols-2 gap-x-8 lg:w-3/4">
                                        <div className=''>
                                            <span className="text-green-400 mr-2">Release date: </span> <span>{item.release_dates[0] ? item.release_dates[0].human : "Uknown"}</span>
                                        </div>
                                        <div className=''>
                                            <span className="text-green-400 mr-2">General rating: </span><span>{item.rating ? Math.trunc(item.rating) : "-"}</span>
                                        </div>
                                    </div>
                                    <div className='text-sm mt-2'>
                                        <span className="text-green-400 mr-2">Genres: </span>
                                        {item.genres?.map((g: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded text-gray-200' key={index}>{g.name}</span>
                                        ))}
                                    </div>

                                    <div className='text-sm mt-2'>
                                        <span className="text-green-400 mr-2">Developers: </span>
                                        {item.involved_companies?.map((c: any, index: number) => (
                                            <span className='text-xs mr-2 bg-gray-600 p-1 rounded text-gray-200' key={index}>{c.company.name}</span>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <p className='mt-6'>{item.summary}</p>
                                </div>
                                <aside className='md:w-1/3 p-4'>
                                    <div className="flex flex-col w-full p-4 blur-none">
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
                                        <UpdateUserVideogameButton gameId={params.game_id} />
                                    </div>
                                </aside>
                            </div>
                            {/* Slider of images */}
                            <SliderImages screenshots={item.screenshots} />
                            {/* <div className='p-4 mt-12'>
                                <div className='relative flex flex-col mb-3'>
                                    <h2 className='text-3xl mb-4'>Popular reviews</h2>
                                    <div className='absolute right-0'>
                                        <Dialog.Trigger asChild>
                                            <AcceptButton text={'Add review'} size='small' />
                                        </Dialog.Trigger>
                                    </div>
                                </div> */}

                            <section className='mt-14 relative'>
                                <Dialog.Trigger asChild className='absolute right-5 z-30'>
                                    <AcceptButton text={'Add review'} size='small' />
                                </Dialog.Trigger>

                                <ReviewSelection gameReviews={gameReviews} game_id={params.game_id} />
                            </section>

                            {/* <div className='grid'>
                                    {gameReviews?.map((r: any, index: number) => (
                                        <div className={`flex flex-col space-y-2 p-4 rounded-lg mb-8 h-32 ${r.recommended ? "bg-teal-950/70" : "bg-rose-950/70"}`} key={index}>
                                            <div className='flex items-center text-gray-300'>
                                                {r.recommended ? <svg className="pr-2" width="25px" height="25px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#15cc67ff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                                : <svg className="pr-2" width="25px" height="25px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>dislike [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -760.000000)" fill="#e02020ff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M139.800374,612 L144.00037,612 L144.00037,600 L139.800374,600 L139.800374,612 Z M127.698085,600 L137.700376,600 L137.700376,611.979 L135.894378,618.174 C135.725328,619.224 134.776129,620 133.66103,620 C132.412581,620 131.400381,619.036 131.400381,617.847 L131.400381,612 L125.873186,612 C124.026238,612 122.659139,610.358 123.074939,608.644 L124.899837,602.109 C125.200137,600.868 126.360386,600 127.698085,600 L127.698085,600 Z" id="dislike-[#ffffff]"> </path> </g> </g> </g> </g></svg>}
                                                <b className={`text-lg mr-4 ${r.recommended ? "text-green-400" : "text-red-400"}`}>{r.recommended ? "RECOMMENDED" : "NOT RECOMMENDED"}</b>
                                                Reviewed by <b className="text-green-400 ml-1 cursor-pointer">{r.user_name}</b>
                                                <span className="ml-8">Likes <b className="text-green-400">{r.likes}</b></span>
                                            </div>
                                            <span className='h-[1px] w-full bg-gray-300'></span>
                                            <div className='h-full'>
                                                <p className=''>{r.body}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {!gameReviews.length && (
                                        <div className='flex justify-center items-center h-36 border border-gray-500'>
                                            <p>There are no reviews of this game yet... Add the first one!</p>
                                        </div>
                                    )}
                                </div> 
                            </div> */}
                        </div>
                    </div>
                </Dialog.Root>
            </section>
        )
        )
    )
}

