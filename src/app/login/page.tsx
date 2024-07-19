"use client"
import React, { useEffect, useState } from 'react'
import { logInUser } from '../actions/logInUser'
import { useFormState } from 'react-dom'
import Link from 'next/link'


export default function LogIn() {
    const backgroundsList: string[] = ["fallout.jpg","bioshock.jpg", "nightcity.jpg"]

    const [cont, setCont] = useState(1)
    const [background, setBackground] = useState<string>(backgroundsList[cont])
    const [state, formAction] = useFormState<any, FormData>(logInUser,undefined)

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setBackground(backgroundsList[cont])
    //         setCont(cont +1)

            
    //         console.log("Backogrund:" + cont + "-" + background)
    //         if(cont == backgroundsList.length){
    //             setCont(1)
    //             console.log("reseteado")
    //         }


    //     },2000);
    //     return ()=> clearInterval(interval)

    // }, [cont])




    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/nightcity.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center bg-black/60 p-8 md:p-24 w-full md:w-[50rem] backdrop-blur-md'>
                <form className='flex flex-col bg-black text-white border border-green-500 w-full md:w-96 p-8 pt-14 pb-14 text-base' action={formAction}>
                    <div className='mb-8'>
                        <h2 className={`text-4xl font-medium`}>Welcome back</h2>
                        <p className='text-gray-400'>Enter to your account</p>
                    </div>
                        <p>Username</p>
                        <input type="text" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="usernameLogIn" id="usernameLogIn"/>
                        <p>Password</p>
                        <input type="password" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="passwordLogIn" id="passwordLogIn"/>
                    
                    {/* Show error message */}
                    {state?.error && <p className='text-red-500'>{state.error}</p>}

                    <button className="mt-2 text-white bg-gradient-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Log in</button>

                    <Link href="/signup" className="text-center text-sky-300 hover:text-sky-600  mt-2 mb-6">Or create a new user</Link>
                </form>
            </div>
        </section>
    )
}