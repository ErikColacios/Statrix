import { getSession } from '@/app/actions/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function listLayout({children}: {children: React.ReactNode}) {
  
  const session = await getSession()

  if(!session.isLoggedIn){
    return(
        redirect("/")
    )
}
    return (
      <section className='bg-black p-4 pt-20 md:p-16 md:pt-24'>
        {children}
      </section>
    )
}