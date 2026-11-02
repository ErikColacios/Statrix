import React from "react";
import Link from "next/link";

export default async function NoListCreated(){
    return (
        <div className='relative isolate flex min-h-96 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-edge bg-white/[0.02] px-6 py-16'>
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(34,197,94,0.12),transparent_70%)]" />
            <div className='flex flex-col items-center text-center'>
                {/* Stacked placeholder covers */}
                <div className="flex" aria-hidden="true">
                    <div className="h-20 w-15 -rotate-6 rounded-lg border border-white/15 bg-elevated" />
                    <div className="-ml-5 h-20 w-15 -translate-y-1 rounded-lg border border-green-500/40 bg-green-500/10" />
                    <div className="-ml-5 h-20 w-15 rotate-6 rounded-lg border border-white/15 bg-elevated" />
                </div>
                <p className='mt-6 text-2xl font-semibold'>No lists yet</p>
                <p className="mt-2 max-w-[44ch] text-smoke">Create your first gaming list. You can create as many lists as you need to organize your library.</p>
                <Link href={"/newList"} className="mt-6 flex h-11 items-center gap-1 rounded-full bg-linear-to-r from-green-500 to-lime-500 px-6 font-semibold text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition duration-300 hover:from-green-400 hover:to-lime-400">
                    <span className="text-lg leading-none">+</span> Create list
                </Link>
            </div>
        </div>
    )
}
