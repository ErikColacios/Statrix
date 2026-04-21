import getSessionUser from '@/actions/getSessionUser'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ListLayout({children}: {children: React.ReactNode}) {
  
  const session:any = await getSessionUser()

  if(!session){
    return(
        redirect("/")
    )
}
    return (
    <section className="flex justify-center text-white bg-gradient-to-b from-black via-gray-900 to-black">
      <div className='w-full sm:w-5/6 2xl:w-3/5 px-4 pt-20'>
        {children}
      </div>
    </section>
    )
}