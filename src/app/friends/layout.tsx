import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function friendsLayout({ children }: { children: React.ReactNode }) {

    const session:any = await getSessionUser()

    if (!session.user) {
        return (
            redirect("/")
        )
    }

    return (
        <section className='h-screen flex justify-center p-4 pt-20 md:p-16 md:pt-20 text-white bg-gradient-to-b from-black via-gray-900 to-black'>
            {children}
        </section>
    )
}