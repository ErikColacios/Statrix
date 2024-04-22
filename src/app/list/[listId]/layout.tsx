import React from 'react'
import { getSession } from '@/app/actions/getSession';
import { redirect } from 'next/navigation';

export default async function listLayout({children}: {children: React.ReactNode}) {

    return (
      <section>
        {children}
      </section>
    )
}