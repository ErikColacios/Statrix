"use client"
import { EmailTemplate } from '@/components/EmailTemplate'
import React from 'react'

export default function Email() {

    return (
        <section className="w-full bg-zinc-700 p-20">
            <EmailTemplate userName='Erik' token={''} />
        </section>
    )
}