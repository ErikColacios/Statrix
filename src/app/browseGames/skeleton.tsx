import React from "react";

export default function SkeletonBrowseGames() {
    return(
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4'>
            {Array.from({ length: 21 }, (_, index) => (
                <div key={index} className='aspect-[3/4] rounded-xl border border-edge bg-elevated animate-pulse' />
            ))}
        </div>
    )
}
