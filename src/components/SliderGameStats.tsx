"use client"
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';

type Props = {
    userGameStats: any | undefined
}

export default function SliderGameStats({userGameStats}:Props) {

    const swiperRef = useRef<SwiperType | null>(null);
    return (
        <>
            <Swiper onSwiper={(swiper: any) => (swiperRef.current = swiper)} slidesPerView={1} pagination={{ clickable: true }} className='w-full rounded-2xl mt-6'>
                <button onClick={() => swiperRef.current?.slidePrev()} className='h-full z-50 absolute left-0 top-0 p-2 hover:bg-black/30 transition'>
                    <svg fill="#ffffff" version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "></polygon> </g></svg>
                </button>
                <button onClick={() => swiperRef.current?.slideNext()} className='h-full z-50 absolute right-0 top-0 p-2 hover:bg-black/30 transition'>
                    <svg fill="#ffffff" version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="11,38.32 28.609,21 11,3.68 13.72,1 34,21.01 13.72,41 "></polygon> </g></svg>
                </button>
                <SwiperSlide>
                    <div className='flex flex-col items-center bg-gradient-to-b from-black via-gray-900 to-black px-3 md:px-10 py-6 h-68 2xl:h-96'>
                        <p className='text-sm md:text-base text-green-400 mb-4'>Top played games</p>
                        <div className="flex ">
                            {userGameStats.topGames.map((item:any, index:number) => (
                                <Link key={index} href={`/gamePage/${item.game_id}`} className='group relative mr-4 flex justify-center items-center cursor-pointer w-16 h-21 sm:w-24 sm:h-32 md:w-32 md:h-48 2xl:w-48 2xl:h-64 transition hover:scale-110'>
                                    <img src={item.game_base_image} className='w-full h-full rounded-lg transition duration-300 group-hover:blur-sm group-hover:brightness-50' alt='Game cover'/>
                                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                        <p className='text-sm lg:text-lg'>{item.game_name}</p>
                                    </div>
                                    <p className='absolute bottom-[-5%] bg-zinc-900 border border-gray-600 px-1 md:px-4 rounded text-xs md:text-sm'>{item.hours_played} h</p>
                                </Link>
                                ))}
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className='flex flex-col items-center bg-gradient-to-b from-black via-gray-900 to-black px-12 py-6 h-68 2xl:h-96'>
                        <p className='text-sm md:text-base text-green-400 mb-4'>Favourite games</p>
                        <div className="flex">
                            {userGameStats.favGames.map((item:any, index:number) => (
                                <Link key={index} href={`/gamePage/${item.game_id}`} className='group relative mr-4 flex justify-center items-center cursor-pointer w-16 h-21 sm:w-24 sm:h-32 md:w-32 md:h-48 2xl:w-48 2xl:h-64 transition hover:scale-110'>
                                    <img src={item.game_base_image} className='w-full h-full rounded-lg transition duration-300 group-hover:blur-sm group-hover:brightness-50' alt='Game cover'/>
                                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                        <p className='text-sm lg:text-lg'>{item.game_name}</p>
                                    </div>
                                    <p className='absolute bottom-[-5%] bg-zinc-900 border border-gray-600 px-4 rounded text-xs md:text-sm'>{index +1}</p>
                                </Link>
                                ))}
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    )
}