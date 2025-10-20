import { getSession } from '@/actions/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ListLayout({children}: {children: React.ReactNode}) {
  
  const session = await getSession()

  if(!session.isLoggedIn){
    return(
        redirect("/")
    )
}
    return (
      <section className='bg-gradient-to-b from-black via-gray-900 to-black p-4 pt-20 md:p-12 md:pt-16'>
        {children}
      </section>
    )
}