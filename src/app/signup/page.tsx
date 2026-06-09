"use client"
import React from 'react'
import { signUp } from '@/actions/signUpUser'
import { useFormState } from 'react-dom'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import Link from 'next/link'

export default function SignUp() {

    const [state, formAction] = useFormState<any, FormData>(signUp, undefined)

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/fallout.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center justify-center bg-black/60 p-8 md:p-24 w-full p-8 sm:w-4/5 lg:w-1/2 2xl:w-1/3 backdrop-blur-md'>
                <div className='flex flex-col bg-zinc-900 text-white border border-green-500 rounded-lg w-full p-8 py-14'>
                    <form className='flex flex-col' action={formAction}>
                        <div className='mb-8'>
                            <h2 className={`text-4xl font-medium`}>New members</h2>
                            <p className='text-gray-400'>Create an account</p>
                        </div>
                            <p className="text-sm text-gray-400">Username</p>
                            <input type="text" className="text-white bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-none" name="userName" id="userName"/>
                            <p className="text-sm text-gray-400">Email</p>
                            <input type="email" className="text-white bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-none" name="email" id="email"/>
                            <p className="text-sm text-gray-400">Password</p>
                            <input type="password" className="text-white bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-none" name="password" id="password"/>
                        
                        {/* Show error message */}
                        {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}

                        <button className="mt-2 rounded-lg bg-gradient-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Sign up</button>
                    </form>
                    <GoogleSignInButton/>
                    <Link href="/login" className="text-center text-sky-300 hover:text-sky-600 mt-4">Or log into your account</Link>
                </div>
            </div>
        </section>
    )
}