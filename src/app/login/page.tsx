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
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/nightcity.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center bg-black/60 p-8 md:p-24 w-full md:w-[50rem] backdrop-blur-md'>
                <form className='flex flex-col bg-black text-white border border-green-500 w-full md:w-96 p-8 pt-14 pb-14 text-base' action={formAction}>
                    <div className='mb-8'>
                        <h2 className={`text-4xl font-medium`}>Welcome back</h2>
                        <p className='text-gray-400'>Enter to your account</p>
                    </div>
                    <p>User name</p>
                    <input type="text" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="usernameLogIn" id="usernameLogIn" />
                    <p>Password</p>
                    <input type="password" className="bg-black text-white border-gray-400 text-black border-2 mb-4 p-1 focus:outline-none focus:border-green-500" name="passwordLogIn" id="passwordLogIn" />

                    {/* Show error message */}
                    {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}

                    <button className="mt-2 text-white bg-gradient-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Log in</button>
                    <GoogleLogInButton />
                    <Link href="/signup" className="text-center text-sky-300 hover:text-sky-600  mt-2 mb-6">Or create a new user</Link>
                </form>
            </div>
        </section>
    )
}