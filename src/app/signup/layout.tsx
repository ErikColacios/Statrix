import React from 'react'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Sign Up | Statrix',
    description: 'Create a new account to start tracking your gaming stats',
}

export default async function SignUpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession();

    if (session) {
        redirect("/");
    }
    return (
        <>
            {children}
        </>
    )
}
