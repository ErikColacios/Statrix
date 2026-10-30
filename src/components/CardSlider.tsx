"use client"
import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Mousewheel } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"

type Props = {
    children: React.ReactNode
    slideClassName?: string // Width of each card, e.g. "w-56! sm:w-60!"
}

// Horizontal slider for cards: drag with the mouse on desktop, swipe on mobile.
// The cards are rendered by the server and passed as children, each child becomes a slide.
export default function CardSlider({ children, slideClassName = "w-56! sm:w-60!" }: Props) {
    return (
        <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto"
            spaceBetween={16}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            freeMode
            mousewheel={{ forceToAxis: true }}
            grabCursor
            className="-mx-4!">
                <div className="hidden sm:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />
            {React.Children.map(children, (child) => (
                <SwiperSlide className={slideClassName}>{child}</SwiperSlide>
            ))}
        </Swiper>
    )
}
