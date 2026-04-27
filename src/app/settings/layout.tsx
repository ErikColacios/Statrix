import React from 'react'
import { redirect } from 'next/navigation'
import getSessionUser from '@/actions/getSessionUser'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {

  const session:any = await getSessionUser()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <section className='h-screen'>
      {children}
    </section>
  )
}