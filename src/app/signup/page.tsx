"use client"
import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { sessionOptions, SessionData } from '@/session_lib'
import { logInUser } from '../actions/logInUser'
import { signUp } from '../actions/signUpUser'
import { useFormState } from 'react-dom'


export default function SignUp() {
    const [state, formAction] = useFormState<any, FormData>(logInUser,undefined)

    return (
        <div className="pt-96 md:pt-24 w-full h-full bg-black flex flex-col lg:flex-row items-center justify-center lg:space-x-8">
            <form className="bg-black text-white w-96 lg:w-[40rem] h-[40rem] p-12 flex flex-col justify-center border text-xl">
                <div className="w-full flex flex-col h-96">
                    <p className="text-3xl md:text-5xl mb-4 bold">NEW USERS</p>
                    <p className="pt-4 pb-8 text-lg">Create an account</p>
                    <p>Username</p>
                    <input type="text" className="border-gray text-black border-2 rounded mb-4" name="username" id="username"/>
                    <p>Email</p>
                    <input type="email" className="border-gray text-black border-2 rounded mb-4" name="email" id="email"/>
                    <p>Password</p>
                    <input type="password" className="border-gray text-black border-2 rounded mb-4" name="password" id="password"/>
                </div>
                <button className="text-white bg-green-400 hover:bg-green-600 transition p-2" formAction={signUp}>Sign up</button>
            </form>

            <form className="bg-black text-white w-96 lg:w-[40rem] h-[40rem] p-12 flex flex-col justify-center border text-xl" action={formAction}>
                <div className="w-full flex flex-col h-96">
                    <p className="text-3xl md:text-5xl mb-4 bold">LOG IN</p>
                    <p className="pt-4 pb-8 text-lg">Log into your account</p>
                    <p>Username</p>
                    <input type="text" className="border-gray text-black border-2 rounded mb-4" name="usernameLogIn" id="usernameLogIn"/>
                    <p>Password</p>
                    <input type="text" className="border-gray text-black border-2 rounded mb-4" name="passwordLogIn" id="passwordLogIn"/>

                    {/* Show error message */}
                    {state?.error && <p className='text-red-500'>{state.error}</p>}

                </div>
                <button className="text-white bg-purple-400 hover:bg-purple-600 transition p-2">Log in</button>
            </form>
        </div>
    )
}