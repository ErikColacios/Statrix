import React from 'react'
import { getSession } from '../actions/getSession'
import { redirect } from 'next/navigation'

export default async function settingsLayout({ children }: { children: React.ReactNode }) {

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