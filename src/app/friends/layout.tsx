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
        <section className='h-screen flex justify-center p-4 pt-20 md:p-16 md:pt-20 text-white bg-linear-to-b from-black via-gray-900 to-black'>
            {children}
        </section>
    )
}