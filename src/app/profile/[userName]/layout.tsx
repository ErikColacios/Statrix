import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile - Statrix',
    description: 'Check your current statistics and your profile info'
}

export default async function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    
    return (
        <>
            {children}
        </>
    )
}