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
      <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>
        <div className="flex items-center text-lg md:text-3xl border-b-2 border-gray-500 pb-3 mb-8">
          <h2 className='text-2xl'>My games</h2>
        </div>
        {children}
      </div>
    </section>
  )
}