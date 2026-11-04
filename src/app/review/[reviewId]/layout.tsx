import React from 'react'
import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'

// The review page is public, so it can be shared with people without an account
export default async function ReviewLayout({ children }: { children: React.ReactNode }) {

    const session: any = await getSessionUser()

    if (session?.user.isNewUser) {
        redirect("/newUser")
    }

    return (
        <section className="flex justify-center text-white min-h-screen bg-black">
            {children}
        </section>
    )
}
