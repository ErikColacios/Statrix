import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Game - Statrix',
    description: 'View a game details, post reviews and set your own rating'
}

export default async function GamePageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}