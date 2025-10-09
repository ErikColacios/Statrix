import React from 'react'

export default async function settingsLayout({ children }: { children: React.ReactNode }) {

//   const session = await getSession()
//   if (!session.isLoggedIn) {
//     redirect("/")
//   }

  return (
    <section className='bg-black h-screen'>
      {children}
    </section>
  )
}