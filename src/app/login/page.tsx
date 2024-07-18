"use client"
import React, { useState } from 'react'
import { logInUser } from '../actions/logInUser'
import { signUp } from '../actions/signUpUser'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import localFont from 'next/font/local'

const backgrounds = ["fallout_landscape.jpg", "bioshock.jpg"]


export default function SignUp() {
    const [background, setBackground] = useState("fallout_landscape.jpg")
    const [state, formAction] = useFormState<any, FormData>(logInUser,undefined)


    return (
        <section className='relative flex w-full h-screen bg-[url("/staticImages/fallout_landscape.jpg")] bg-cover '>
            <div className='absolute bg-black/60 w-full h-full'></div>
            <div className='flex items-center bg-black/80 p-8 md:p-24 w-full md:w-[50rem] backdrop-blur-md'>
                <form className='flex flex-col bg-black text-white border border-green-500 w-full md:w-96 p-8 pt-14 pb-14 text-base' action={formAction}>
                    <div className='mb-8'>
                        <h2 className={`text-4xl font-medium`}>Welcome back</h2>
                        <p className='text-gray-400'>Enter to your account</p>
                    </div>
                        <p>Username</p>
                        <input type="text" className="bg-black text-white border-gray text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="usernameLogIn" id="usernameLogIn"/>
                        <p>Password</p>
                        <input type="text" className="bg-black text-white border-gray text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="passwordLogIn" id="passwordLogIn"/>
                    
                    {/* Show error message */}
                    {state?.error && <p className='text-red-500'>{state.error}</p>}

                    <button className="mt-2 text-white bg-gradient-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Log in</button>

                    <Link href="/signup" className="text-center text-sky-300 hover:text-sky-600  mt-2">Or create a new user</Link>
                </form>
            </div>

        </section>


        // <div className="pt-24 lg:pt-64 w-full h-fit bg-black flex flex-col lg:flex-row items-center justify-center lg:space-x-8">
        //     <form className="bg-black text-white w-96 lg:w-[40rem] h-[40rem] p-12 flex flex-col justify-center border text-xl" action={formAction}>
        //         <div className="w-full flex flex-col h-96">
        //             <p className="text-3xl md:text-5xl mb-4 bold">LOG IN</p>
        //             <p className="pt-4 pb-8 text-lg">Log into your account</p>
        //             <p>Username</p>
        //             <input type="text" className="border-gray text-black border-2 rounded mb-4" name="usernameLogIn" id="usernameLogIn"/>
        //             <p>Password</p>
        //             <input type="text" className="border-gray text-black border-2 rounded mb-4" name="passwordLogIn" id="passwordLogIn"/>

        //             {/* Show error message */}
        //             {state?.error && <p className='text-red-500'>{state.error}</p>}

        //         </div>
        //         <button className="text-white bg-purple-400 hover:bg-purple-600 transition p-2">Log in</button>
        //         <Link href="/signup" className="hover:text-green-400">Or create an account</Link>
        //     </form>
        // </div>
    )
}