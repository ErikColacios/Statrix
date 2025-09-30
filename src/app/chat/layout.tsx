import { getSession } from '@/app/actions/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function chatLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession()

    if (!session.isLoggedIn) {
        return (
            redirect("/")
        )
    }

    return (
        <section className='flex p-4 pt-20 md:p-16 md:pt-20 text-white bg-gradient-to-b from-black via-gray-900 to-black'>
            {children}
        </section>
    )
}