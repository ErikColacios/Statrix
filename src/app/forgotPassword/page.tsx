"use client"
import React from 'react'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { sendEmailResetPassword } from '@/actions/sendEmailResetPassword'

export default function LogIn() {

    const router = useRouter()
    const [state, formAction] = useFormState<any, FormData>(handleSubmit, undefined)

    async function handleSubmit(prevState: any, formData: FormData) {
        const email = formData.get("email") as string;

        if (email === "") {
            return { error: "Introduce a valid email" };
        }

        const response = await sendEmailResetPassword(email);
        if(response){
            return { error: response };
        }

        // if (response?.ok) {
        //     router.push("/")
        //     router.refresh()
        // }
    }

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/bg_nightcity.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center justify-center bg-black/60 p-3 md:p-8 md:p-20 w-full sm:w-4/5 lg:w-1/2 2xl:w-1/3 backdrop-blur-md'>
                <div className='flex flex-col bg-zinc-900 text-white border border-green-500 rounded-2xl w-full p-8 py-14'>
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
                    <Link href={"login"} className='hover:text-green-400 hover:underline text-center mt-4'>Back to log in</Link>
                </div>
            </div>
        </section>
    )
}