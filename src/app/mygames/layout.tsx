import React from 'react'
import getSessionUser from '@/actions/getSessionUser'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My Games - Statrix',
  description: 'Manage your game collection'
}

export default async function MyGamesLayout({ children }: { children: React.ReactNode }) {

  const session: any = await getSessionUser()

  if (!session) {
    return (
      redirect("/")
    )
  }

  if (session?.user.isNewUser) {
    redirect("/newUser")
  }

  return (
    <section className="flex justify-center text-white min-h-screen bg-linear-to-b from-black via-gray-900 to-black min-h-screen">
      {children}
    </section>
  )
}