import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Log In - Statrix',
    description: 'Log to your account'
}

export default async function LogInLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}