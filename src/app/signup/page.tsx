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
        <section className='relative isolate flex min-h-screen w-full bg-void text-snow'>
            {/* Form side */}
            <div className='relative flex w-full items-center justify-center px-6 pt-28 pb-16 lg:w-1/2'>
                <div aria-hidden="true" className='pointer-events-none absolute inset-0 -z-10'>
                    <div className='absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_45%,rgba(34,197,94,0.14),transparent_72%)]' />
                    <div className='absolute inset-0 bg-[radial-gradient(36%_30%_at_20%_15%,rgba(163,230,53,0.08),transparent_70%)]' />
                    <div className='absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]' />
                </div>

                <div className='relative w-full max-w-md overflow-hidden rounded-2xl border border-edge bg-card/80 p-8 shadow-[0_40px_120px_-30px_rgba(34,197,94,0.3)] backdrop-blur-xl sm:p-10'>
                    <div aria-hidden="true" className='pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-white/15 via-green-300/5 to-transparent mix-blend-screen' />

                    {(nextSlide === 0) &&
                        <>
                            <img src="/logos/st1_white.png" alt="" className='h-10 w-10 object-contain' />
                            <h1 className='mt-6 text-4xl font-semibold tracking-[-0.03em] headline-sheen'>New members</h1>
                            <p className='mt-2 text-smoke'>
                                Already have an account? <Link href="/login" className='font-medium text-snow transition hover:text-green-400'>Log in</Link>
                            </p>

                            <form className='mt-8 flex flex-col' action={formAction}>
                                <label htmlFor="userNameSignUp" className="mb-1.5 text-sm text-smoke">Username</label>
                                <input type="text" name="userNameSignUp" id="userNameSignUp" placeholder='userName' autoComplete="username"
                                    className="mb-4 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-snow outline-hidden transition placeholder:text-zinc-500 focus:border-green-500 focus:bg-white/10" />

                                <label htmlFor="emailSignUp" className="mb-1.5 text-sm text-smoke">Email</label>
                                <input type="email" name="emailSignUp" id="emailSignUp" placeholder='you@example.com' autoComplete="email"
                                    className="mb-4 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-snow outline-hidden transition placeholder:text-zinc-500 focus:border-green-500 focus:bg-white/10" />

                                <label htmlFor="passwordSignUp" className="mb-1.5 text-sm text-smoke">Password</label>
                                <input type="password" name="passwordSignUp" id="passwordSignUp" placeholder='password' autoComplete="new-password"
                                    className="mb-4 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-snow outline-hidden transition placeholder:text-zinc-500 focus:border-green-500 focus:bg-white/10" />

                                {/* Show error message */}
                                {state?.error &&
                                    <p className='mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400'>{state.error}</p>}

                                <button className="mt-2 h-12 rounded-full bg-linear-to-r from-green-400 to-lime-400 font-semibold text-black shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition duration-300 hover:from-green-300 hover:to-lime-300">
                                    Sign up
                                </button>
                            </form>

                            <div className='mt-6 flex items-center gap-3 text-xs text-smoke'>
                                <span className='h-px flex-1 bg-edge' />
                                or
                                <span className='h-px flex-1 bg-edge' />
                            </div>
                            <div className='flex flex-col [&>button]:mt-2 [&>button]:h-12 [&>button]:rounded-full [&>button]:border-white/10'>
                                <GoogleSignInButton />
                            </div>
                        </>
                    }
                    {(nextSlide === 1) &&
                        <div className='flex flex-col items-center justify-center text-center py-10 animate-slide-left'>
                            <div className='flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400'>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="currentColor" strokeWidth="1.5"></path> <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                            </div>
                            <h1 className='mt-6 text-3xl font-semibold tracking-[-0.03em] headline-sheen'>Check your email</h1>
                            <p className='mt-2 text-smoke'>We sent a verification link to <span className='text-snow'>{email}</span></p>
                            <Link href={"/login"} className="mt-8 flex h-12 items-center rounded-full bg-linear-to-r from-green-400 to-lime-400 px-8 font-semibold text-black shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition duration-300 hover:from-green-300 hover:to-lime-300">
                                Back to log in
                            </Link>
                        </div>
                    }
                </div>
            </div>

            {/* Image side */}
            <div className='relative hidden overflow-hidden border-l border-edge lg:block lg:w-1/2'>
                <div className='absolute inset-0 bg-[url(/staticImages/bg_fallout.jpg)] bg-cover bg-center' />
                <div className='absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/10' />
                <div className='absolute inset-0 bg-gradient-to-r from-void/60 to-transparent' />

                <div className='absolute inset-x-0 bottom-0 p-12 xl:p-16'>
                    <h2 className='text-display-md font-semibold text-balance headline-sheen'>
                        <span className='block'>Start your</span>
                        <span className='block'>gaming profile.</span>
                    </h2>
                    <p className='mt-4 max-w-[42ch] text-smoke'>Import your Steam library, rate what you have played and find people who play like you.</p>
                </div>
            </div>
        </section>
    )
}