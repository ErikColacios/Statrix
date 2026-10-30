import React from 'react'
import getSessionUser from '@/actions/getSessionUser'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Community - Statrix',
    description: 'What the community is playing',
}

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
    const session: any = await getSessionUser()

    if (!session) {
        return redirect('/login')
    }

    console.log(session)
    if (session?.user.isNewUser) {
        redirect('/newUser')
    }

    return (
        <section className="flex justify-center text-white min-h-screen bg-canvas">
            {children}
        </section>
    )
}