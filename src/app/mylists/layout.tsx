import React from 'react'
import Link from "next/link"
import getSessionUser from '@/actions/getSessionUser'
import NotLoggedVideogamelist from '@/components/NotLoggedVideogamelist'
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
    <section className="relative isolate min-h-screen w-full bg-void text-snow">
      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]">
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(34,197,94,0.14),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(30%_40%_at_85%_20%,rgba(163,230,53,0.07),transparent_70%)]" />
      </div>

      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 pt-28 pb-24 md:pt-32'>
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-green-400">Lists</p>
            <h1 className='mt-3 text-display-md font-semibold headline-sheen'>My lists</h1>
            <p className="mt-3 max-w-[48ch] text-smoke">Organize your games in collections and rankings, and share them on your profile.</p>
          </div>
          <Link href={"newList"} className="sm:ml-auto flex h-11 shrink-0 items-center justify-center gap-1 rounded-full bg-linear-to-r from-green-500 to-lime-500 px-6 font-semibold text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition duration-300 hover:from-green-400 hover:to-lime-400">
            <span className="text-lg leading-none">+</span> New list
          </Link>
        </div>

        <div className="mt-10">
          {children}
        </div>
      </div>
    </section>
  )
}
