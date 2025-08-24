import { getSession } from '@/app/actions/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function friendsLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession()

    if (!session.isLoggedIn) {
        return (
            redirect("/")
        )
    }

    return (
        <section className='flex justify-center bg-black p-4 pt-20 md:p-16 md:pt-20 text-white'>
            {children}
        </section>
    )
}