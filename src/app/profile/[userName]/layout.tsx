import { getSession } from '@/app/actions/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function listLayout({ children }: { children: React.ReactNode }) {

  const session = await getSession()
  if (!session.isLoggedIn) {
    redirect("/")
  }

  return (
    <section className='bg-black h-screen'>
      {children}
    </section>
  )
}