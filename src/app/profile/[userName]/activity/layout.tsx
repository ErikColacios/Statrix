import React from 'react'
import getSessionUser from '@/actions/getSessionUser'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Activity - Statrix',
  description: 'All the recent activity of a Statrix player'
}

export default async function ActivityLayout({ children }: { children: React.ReactNode }) {

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
    <section className="flex justify-center text-white min-h-screen bg-black">
      {children}
    </section>
  )
}
