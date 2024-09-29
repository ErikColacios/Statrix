import React from "react";
import LoadingAnimation from "../components/LoadingAnimation";

export default function SkeletonNewVideogameList() {
    return(
        <div className='w-full flex md:grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
            <div className="hidden md:contents">
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-2xl lg:w-48 lg:h-64'></div>
            </div>
            <div className="w-full flex justify-center items-center md:hidden">
                <LoadingAnimation/>
            </div>
        </div>
    )
}