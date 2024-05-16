import React from 'react'

export default async function listLayout({children}: {children: React.ReactNode}) {

    return (
      <section>
        {children}
      </section>
    )
}