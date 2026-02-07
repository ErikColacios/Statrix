import { getSession } from '@/actions/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ListLayout({ children }: { children: React.ReactNode }) {

  const session = await getSession()
  if (!session.isLoggedIn) {
    redirect("/")
  }

  return (
    <section className='bg-black text-white pt-14 md:pt-20'>
      {children}
    </section>
  )
}