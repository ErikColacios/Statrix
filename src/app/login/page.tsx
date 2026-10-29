"use client"
import React from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import GoogleLogInButton from '@/components/GoogleSignInButton'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogIn() {

    const router = useRouter()
    const [state, formAction] = useFormState<any, FormData>(handleSubmit, undefined)

    async function handleSubmit(prevState: any, formData: FormData) {
        const userNameLogIn = formData.get("usernameLogIn") as string;
        const passwordLogIn = formData.get("passwordLogIn") as string;

        if (passwordLogIn === "" || userNameLogIn === "") {
            return { error: "There are missing fields" };
        }

        // The signIn function from next-auth will call the authorize function in the credentials provider of the [...nextauth] route.
        // Then it will check if the user exists and create the session.
        const response = await signIn("credentials", {
            userNameLogIn,
            passwordLogIn,
            redirect: false
        })

        if (response?.error == 'CredentialsSignin') {
            return { error: "Invalid user or password" }
        }
        
        if (response?.ok) {
            router.push("/community")
            router.refresh()
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

                    <img src="/logos/st1_white.png" alt="" className='h-10 w-10 object-contain' />
                    <h1 className='mt-6 text-4xl font-semibold tracking-[-0.03em] headline-sheen'>Welcome back</h1>
                    <p className='mt-2 text-smoke'>
                        Don&apos;t have an account? <Link href="/signup" className='font-medium text-snow transition hover:text-green-400'>Sign up</Link>
                    </p>

                    <form className='mt-8 flex flex-col' action={formAction}>
                        <label htmlFor="usernameLogIn" className="mb-1.5 text-sm text-smoke">User name</label>
                        <input type="text" name="usernameLogIn" id="usernameLogIn" placeholder='userName' autoComplete="username"
                            className="mb-4 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-snow outline-hidden transition placeholder:text-zinc-500 focus:border-green-500 focus:bg-white/10" />

                        <div className='mb-1.5 flex items-baseline justify-between'>
                            <label htmlFor="passwordLogIn" className="text-sm text-smoke">Password</label>
                            <Link href={"forgotPassword"} className='text-xs text-smoke transition hover:text-green-400'>Forgot your password?</Link>
                        </div>
                        <input type="password" name="passwordLogIn" id="passwordLogIn" placeholder='password' autoComplete="current-password"
                            className="mb-4 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-snow outline-hidden transition placeholder:text-zinc-500 focus:border-green-500 focus:bg-white/10" />

                        {/* Show error message */}
                        {state?.error &&
                            <p className='mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400'>{state.error}</p>}

                        <button className="mt-2 h-12 rounded-full bg-linear-to-r from-green-400 to-lime-400 font-semibold text-black shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] transition duration-300 hover:from-green-300 hover:to-lime-300">
                            Log in
                        </button>
                    </form>

                    <div className='mt-6 flex items-center gap-3 text-xs text-smoke'>
                        <span className='h-px flex-1 bg-edge' />
                        or
                        <span className='h-px flex-1 bg-edge' />
                    </div>
                    <div className='flex flex-col [&>button]:mt-2 [&>button]:h-12 [&>button]:rounded-full [&>button]:border-white/10'>
                        <GoogleLogInButton />
                    </div>
                </div>
            </div>

            {/* Image side */}
            <div className='relative hidden overflow-hidden border-l border-edge lg:block lg:w-1/2'>
                <div className='absolute inset-0 bg-[url(/staticImages/bg_nightcity.jpg)] bg-cover bg-center' />
                <div className='absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/10' />
                <div className='absolute inset-0 bg-gradient-to-r from-void/60 to-transparent' />

                <div className='absolute inset-x-0 bottom-0 p-12 xl:p-16'>
                    <h2 className='text-display-md font-semibold text-balance headline-sheen'>
                        <span className='block'>Every game.</span>
                        <span className='block'>One profile.</span>
                    </h2>
                    <p className='mt-4 max-w-[42ch] text-smoke'>Pick up where you left off: your library, your lists and your friends are waiting.</p>
                </div>
            </div>
        </section>
    )
}