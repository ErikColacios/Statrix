import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Import Steam games - Statrix',
    description: 'Import your Steam games into Statrix'
}

export default async function ImportSteamGamesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}