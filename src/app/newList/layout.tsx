import React from 'react'
import type { Metadata } from 'next'
import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'New List - Statrix',
    description: 'Create a new game list'
}

export default async function NewListLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session: any = await getSessionUser()

    if (!session) {
        redirect("/login")
    }
    
    return (
        <>
            {children}
        </>
    )
}