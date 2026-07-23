"use server"
import React from 'react'
import Link from 'next/link'
import updateEmailVerificationToken from '@/actions/updateEmailVerificationToken';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{token?: string}>;
}

export default async function VerifyEmail({searchParams}:Props) {

    const token:string = (await searchParams).token as string
    const response = await updateEmailVerificationToken(token)

    if(!response.success){
        redirect("/")
    }
    
    return (
        <section className="w-full flex justify-center items-center text-white pt-20">
            <div className='animate-slide-bottom flex flex-col justify-center items-center space-y-8 p-6 md:p-16 lg:w-1/2 rounded-xl cardReviewGreen shadow-green-500/30 border-green-600'>
                <p className='md:text-2xl'>Your email has been verified ✅</p>
                <Link href="/login" className="sm:w-48 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                    Continue to Statrix
                </Link>
            </div>
        </section>
    )
}