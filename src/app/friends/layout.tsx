import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Friends - Statrix',
    description: 'Manage your friendships and connect with other players'
}

export default async function FriendsLayout({ children }: { children: React.ReactNode }) {

    const session:any = await getSessionUser()

    if (!session) {
        return (
            redirect("/")
        )
    }

    return (
        <section className='relative min-h-screen flex justify-center px-4 pt-24 pb-16 md:px-16 md:pt-28 text-white bg-zinc-950 overflow-hidden'>
            {/* Subtle background glows */}
            <div className='absolute inset-0 pointer-events-none' aria-hidden="true">
                <div className='absolute -top-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-green-600/10 blur-3xl' />
                <div className='absolute top-1/2 -right-40 w-[28rem] h-[28rem] rounded-full bg-lime-500/5 blur-3xl' />
            </div>
            <div className='relative w-full flex justify-center'>
                {children}
            </div>
        </section>
    )
}
