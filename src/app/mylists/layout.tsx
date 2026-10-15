import React from 'react'
import Link from "next/link"
import { pool } from '@/util/postgres'
import getSessionUser from '@/actions/getSessionUser'
import NotLoggedVideogamelist from '@/components/NotLoggedVideogamelist'
import PrimaryButton from '@/components/PrimaryButton'
import NoListCreated from '@/components/NoListCreated'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My Lists - Statrix',
  description: 'Manage your custom game lists'
}

export default async function MyListsLayout({ children }: { children: React.ReactNode }) {

  const session: any = await getSessionUser()

  if (session?.user.isNewUser) {
    redirect("/newUser")
  }

  if (!session) {
    return (
      <div className='flex h-screen items-center'>
        <NotLoggedVideogamelist />
      </div>
    )
  }

  return (
    <section className="flex justify-center text-white min-h-screen bg-linear-to-b from-black via-gray-900 to-black min-h-screen">
      <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>
        <div className="flex items-center text-lg md:text-3xl pb-3 mb-4">
          <h2 className='text-4xl font-bold md:text-5xl'>My lists</h2>
          <Link href={"newList"} className="ml-auto text-base px-5 py-2 rounded-lg bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
          + New list</Link>
        </div>
        {children}
      </div>
    </section>
  )
}