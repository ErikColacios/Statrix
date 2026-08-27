"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { sendEmailResetPassword } from '@/actions/sendEmailResetPassword'

export default function LogIn() {

    const [state, formAction] = useFormState<any, FormData>(handleSubmit, undefined)
    const [nextSlide, setNextSlide] = useState<number>(0)

    async function handleSubmit(prevState: any, formData: FormData) {
        const email = formData.get("email") as string;

        if (email === "") {
            return { error: "Introduce a valid email" };
        }

        const response = await sendEmailResetPassword(email);
        if (response) {
            return { error: response };
        } else {
            setNextSlide(1)
        }
    }

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/bg_nightcity.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center justify-center bg-black/60 p-3 md:p-8 md:p-20 w-full sm:w-4/5 lg:w-1/2 2xl:w-1/3 backdrop-blur-md'>
                <div className='flex flex-col bg-zinc-900 text-white border border-green-500 rounded-2xl w-full p-8 py-14'>
                    {(nextSlide === 0) &&
                        <form className='flex flex-col' action={formAction}>
                            <div className='mb-8 text-center'>
                                <h2 className={`text-2xl md:text-4xl font-medium`}>Forgot your password?</h2>
                            </div>
                            <p className='text-gray-400 mt-1'>No problem. Introduce your email and we'll send you a link to reset your password</p>

                            <p className="text-sm text-gray-400 mt-4">Email</p>
                            <input type="email" className="text-white bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600 p-1 focus:outline-hidden" name="email" id="email" placeholder='you@example.com' />

                            {/* Show error message */}
                            <div className='mt-3'>
                                {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}
                            </div>

                            <button className="mt-2 rounded-lg bg-linear-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Send link</button>
                        </form>
                    }
                    {(nextSlide === 1) &&
                        <div className='flex flex-col items-center justify-center py-18 text-center animate-slide-left'>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="#ffffff" strokeWidth="1.5"></path> <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                            <p className='text-2xl font-bold mt-2'>Check your email</p>
                            <p className='text-gray-400'>We just sent you a password reset link to your mailbox.</p>
                        </div>
                    }
                    <Link href={"login"} className='hover:text-green-400 hover:underline text-center mt-4'>Back to log in</Link>
                </div>
            </div>
        </section>
    )
}