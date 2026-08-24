import React from "react";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function SkeletonBrowseGames() {
    return(
        <div className='w-full flex md:grid justify-center grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-8 gap-4'>
            <div className="hidden md:contents">
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
                <div className='bg-gray-700 animate-pulse rounded-xl lg:w-48 lg:h-64'></div>
            </div>
            <div className="w-full flex justify-center items-center md:hidden">
                <LoadingAnimation/>
            </div>
        </div>
    )
}