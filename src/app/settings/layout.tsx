import React from 'react'
import { redirect } from 'next/navigation'
import getSessionUser from '@/actions/getSessionUser'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Settings - Statrix',
    description: 'Manage your account settings'
}

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {

  const session:any = await getSessionUser()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <section className='h-full bg-black'>
      {children}
    </section>
  )
}