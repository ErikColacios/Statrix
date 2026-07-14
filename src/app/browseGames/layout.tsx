import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Games - Statrix',
    description: 'Browse and explore different games'
}

export default async function BrowseGamesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}