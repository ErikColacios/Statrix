import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up | Statrix',
    description: 'Create a new account to start tracking your gaming stats'
}

export default async function SignUpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}
