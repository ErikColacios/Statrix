import React from "react";

export default function SkeletonFriends() {
    return (
        <div className='w-full flex flex-col space-y-4 mt-5'>
            <div className='bg-gray-700 animate-pulse rounded-lg w-full h-16'></div>
            <div className='bg-gray-700 animate-pulse rounded-lg w-full h-16'></div>
            <div className='bg-gray-700 animate-pulse rounded-lg w-full h-16'></div>
            <div className='bg-gray-700 animate-pulse rounded-lg w-full h-16'></div>
        </div>
    )
}