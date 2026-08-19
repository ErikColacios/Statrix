"use client"
import React, { useState } from 'react'
import { signUpUser } from '@/actions/signUpUser'
import { useFormState } from 'react-dom'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import Link from 'next/link'

export default function SignUp() {

    const [state, formAction] = useFormState<any, FormData>(handleSubmit, undefined)
    const [nextSlide, setNextSlide] = useState<number>(0)
    const [email, setEmail] = useState<string>("")

    async function handleSubmit(prevState: any, formData: FormData) {
        const userNameSignUp = formData.get("userNameSignUp") as string;
        const emailSignUp = formData.get("emailSignUp") as string;
        const passwordSignUp = formData.get("passwordSignUp") as string;

        if (userNameSignUp === "" || emailSignUp === "" || passwordSignUp === "") {
            return { error: "There are missing fields" };
        } else {
            const response = await signUpUser(prevState, formData)
            if(response?.error){
                return { error: response.error };
            } else {
                setEmail(emailSignUp)
                setNextSlide(1)
            }
        }
    }

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/bg_fallout.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center justify-center bg-black/60 p-3 md:p-8 md:p-20 w-full sm:w-4/5 lg:w-1/2 2xl:w-1/3 backdrop-blur-md'>
                <div className='flex flex-col bg-zinc-900 text-white border border-green-500 rounded-lg w-full p-6 py-14'>
                    {(nextSlide === 0) &&
                        <>
                            <form className='flex flex-col' action={formAction}>
                                <div className='mb-8 text-center'>
                                    <h2 className={`text-2xl md:text-4xl font-medium`}>New members</h2>
                                    <p className='text-gray-400 mt-2'>Already have an account? <Link href="/login" className='text-white hover:text-green-500'>Log in</Link></p>
                                </div>
                                <p className="text-sm text-gray-400">Username</p>
                                <input type="text" className="text-white bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-hidden" name="userNameSignUp" id="userNameSignUp" />
                                <p className="text-sm text-gray-400">Email</p>
                                <input type="email" className="text-white bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-hidden" name="emailSignUp" id="emailSignUp" />
                                <p className="text-sm text-gray-400">Password</p>
                                <input type="password" className="text-white bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-hidden" name="passwordSignUp" id="passwordSignUp" />

                                {/* Show error message */}
                                {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}

                                <button className="mt-2 rounded-lg bg-linear-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Sign up</button>

                            </form>
                            <GoogleSignInButton />
                        </>
                    }
                    {(nextSlide === 1) &&
                        <div className='flex flex-col items-center justify-center text-center h-96 animate-slide-left'>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="#ffffff" strokeWidth="1.5"></path> <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                            <p className='text-2xl font-bold mt-2'>Check your email</p>
                            <p className='text-gray-400'>We sent a verification link to {email}</p>
                            <Link href={"/login"} className="mt-6 rounded-lg bg-linear-to-r from-green-400 to-lime-500 px-6 py-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Back to log in</Link>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}