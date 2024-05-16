import React from 'react'

export default async function gamePageLayout({children}: {children: React.ReactNode}) {

    return (
      <section className='bg-black h-full'>
        {children}
      </section>
    )
}