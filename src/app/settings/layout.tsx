import React from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/actions/getSession'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {

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