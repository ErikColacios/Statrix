"use client"
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
    screenshots: any[],
}

export default function SliderImages({ screenshots }: Props) {

    const swiperRef = useRef<SwiperType | null>(null);
    return (
        <>
            <Swiper onSwiper={(swiper: any) => (swiperRef.current = swiper)} slidesPerView={1} breakpoints={{1024: {slidesPerView: 2}}} pagination={{ clickable: true }} className='relative mt-6'>
                <button onClick={() => swiperRef.current?.slidePrev()} className='h-full z-50 absolute left-0 top-0 p-2 hover:bg-black/30 transition'>
                    <svg fill="#ffffff" version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 "></polygon> </g></svg>
                </button>
                <button onClick={() => swiperRef.current?.slideNext()} className='h-full z-50 absolute right-0 top-0 p-2 hover:bg-black/30 transition'>
                    <svg fill="#ffffff" version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 42 42" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon fillRule="evenodd" points="11,38.32 28.609,21 11,3.68 13.72,1 34,21.01 13.72,41 "></polygon> </g></svg>
                </button>
                <SwiperSlide><img src={screenshots ? `https://images.igdb.com/igdb/image/upload/t_720p/${screenshots[0].image_id}.png` : ""} className='xl:h-72 w-full' alt='Slide 1'/></SwiperSlide>
                <SwiperSlide><img src={screenshots ? `https://images.igdb.com/igdb/image/upload/t_720p/${screenshots[1].image_id}.png` : ""} className='xl:h-72 w-full' alt='Slide 2'/></SwiperSlide>
                <SwiperSlide><img src={screenshots ? `https://images.igdb.com/igdb/image/upload/t_720p/${screenshots[2].image_id}.png` : ""} className='xl:h-72 w-full' alt='Slide 3'/></SwiperSlide>
                <SwiperSlide><img src={screenshots ? `https://images.igdb.com/igdb/image/upload/t_720p/${screenshots[3].image_id}.png` : ""} className='xl:h-72 w-full' alt='Slide 4'/></SwiperSlide>
            </Swiper>
        </>
    )
}