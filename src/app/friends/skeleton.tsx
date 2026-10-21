import React from "react";

export default function SkeletonFriends() {
    return (
        <div className='w-full flex flex-col gap-3 mt-6'>
            {[0, 1, 2, 3].map((index: number) => (
                <div key={index} className='flex items-center gap-4 h-20 px-4 rounded-2xl border border-white/10 bg-white/5'>
                    <div className='w-12 h-12 rounded-full bg-white/10 animate-pulse'></div>
                    <div className='flex flex-col gap-2'>
                        <div className='w-32 h-3.5 rounded-full bg-white/10 animate-pulse'></div>
                        <div className='w-20 h-3 rounded-full bg-white/5 animate-pulse'></div>
                    </div>
                    <div className='ml-auto w-24 h-9 rounded-xl bg-white/5 animate-pulse'></div>
                </div>
            ))}
        </div>
    )
}
