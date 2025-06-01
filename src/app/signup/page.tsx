"use client"
import React from 'react'
import { logInUser } from '../actions/logInUser'
import { signUp } from '../actions/signUpUser'
import { useFormState } from 'react-dom'

export default function SignUp() {
    const [state, formAction] = useFormState<any, FormData>(logInUser,undefined)

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/fallout.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center bg-black/60 p-8 md:p-24 w-full md:w-[50rem] backdrop-blur-md'>
                <form className='flex flex-col bg-black text-white border border-green-500 w-full md:w-96 p-8 pt-14 pb-14 text-base' action={formAction}>
                    <div className='mb-8'>
                        <h2 className={`text-4xl font-medium`}>New members</h2>
                        <p className='text-gray-400'>Create an account</p>
                    </div>
                        <p>Username</p>
                        <input type="text" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="username" id="username"/>
                        <p>Email</p>
                        <input type="email" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="email" id="email"/>
                        <p>Password</p>
                        <input type="password" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="password" id="password"/>
                    
                    {/* Show error message */}
                    {state?.error && <p className='text-red-500'>{state.error}</p>}

                    <button className="mt-2 text-white bg-gradient-to-r from-orange-300 to-yellow-400 p-2 hover:from-orange-400 hover:to-yellow-500 "  formAction={signUp}>Sign up</button>
                </form>
            </div>
        </section>
    )
}