import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Forgot password - Statrix',
    description: 'Recover your password if you forgot it.'
}

export default async function ForgotPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}