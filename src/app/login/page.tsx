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
            router.push("/")
            router.refresh()
        }
    }

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/bg_nightcity.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center justify-center bg-black/60 p-8 md:p-24 w-full p-8 sm:w-4/5 lg:w-1/2 2xl:w-1/3 backdrop-blur-md'>
                <div className='flex flex-col bg-zinc-900 text-white border border-green-500 rounded-lg w-full p-8 py-14'>
                    <form className='flex flex-col' action={formAction}>
                        <div className='mb-8'>
                            <h2 className={`text-4xl font-medium`}>Welcome back</h2>
                            <p className='text-gray-400'>Enter to your account</p>
                        </div>
                        <p className="text-sm text-gray-400">User name</p>
                        <input type="text" className="text-white bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-none" name="usernameLogIn" id="usernameLogIn" />
                        <p className="text-sm text-gray-400">Password</p>
                        <input type="password" className="text-white bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-none" name="passwordLogIn" id="passwordLogIn" />

                        {/* Show error message */}
                        {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}

                        <button className="mt-2 rounded-lg bg-gradient-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Log in</button>
                    </form>
                    <GoogleLogInButton />
                    <Link href="/signup" className="text-center text-sky-300 hover:text-sky-600  mt-2 mb-6">Or create a new user</Link>
                </div>
            </div>
        </section>
    )
}