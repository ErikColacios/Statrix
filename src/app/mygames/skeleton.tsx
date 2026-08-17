import React from "react";

export default function SkeletonMyGames() {
    return(
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='bg-gray-700 animate-pulse rounded-2xl w-full h-42'></div>
            <div className='bg-gray-700 animate-pulse rounded-2xl w-full h-42'></div>
            <div className='bg-gray-700 animate-pulse rounded-2xl w-full h-42'></div>
            <div className='bg-gray-700 animate-pulse rounded-2xl w-full h-42'></div>
        </div>
    )
}