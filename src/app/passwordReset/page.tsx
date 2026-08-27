"use client"
import updateResetPasswordToken from '@/actions/updateResetPasswordToken';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import updateUserPassword from '@/actions/updateUserPassword';

interface Props {
    searchParams: Promise<{ token?: string }>;
}

export default function PasswordReset({ searchParams }: Props) {

    const router = useRouter()
    const [state, formAction] = useFormState<any, FormData>(handleSubmit, undefined)
    const [email, setEmail] = useState<string | undefined | null>("")
    const [tokenId, setTokenId] = useState<string | undefined | null>("")

    useEffect(() => {
        async function verifyResetToken(){
            const token: string = (await searchParams).token as string
            const response = await updateResetPasswordToken(token)

            if (!response.success) {
                router.push("/")
            } else {
                setEmail(response?.email)
                setTokenId(response?.tokenId)
                console.log(response?.email, response?.tokenId)
            }
        }
        verifyResetToken()
    }, [])


    async function handleSubmit(prevState: any, formData: FormData) {
        const newPassword = formData.get("newPassword") as string;

        if (newPassword === "") {
            return { error: "Introduce a valid password" };

        } else if (email === "" || email === null) {
            return { error: "Email not valid." };
        }

        const response = await updateUserPassword(newPassword, email, tokenId)

        if (response.success) {
            router.push("/")
            router.refresh()
            console.log("Password changed successfully!")
        }
    }

    return (
        <section className={`relative flex w-full h-screen bg-[url("/staticImages/bg_nightcity.jpg")] bg-cover`}>
            <div className='absolute bg-black/50 w-full h-full'></div>
            <div className='flex items-center justify-center bg-black/60 p-3 md:p-8 md:p-20 w-full sm:w-4/5 lg:w-1/2 2xl:w-1/3 backdrop-blur-md'>
                <div className='flex flex-col bg-zinc-900 text-white border border-green-500 rounded-2xl w-full p-8 py-14'>
                    <form className='flex flex-col' action={formAction}>
                        <div className='mb-8 text-center'>
                            <h2 className={`text-2xl md:text-4xl font-medium`}>Password reset</h2>
                        </div>
                        <p className='text-gray-400 mt-1'>Type your new password</p>

                        <p className="text-sm text-gray-400 mt-4">New password</p>
                        <input type="password" className="text-white bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600 mb-4 p-1 focus:outline-hidden" name="newPassword" id="newPassword" placeholder="password" />

                        {/* Show error message */}
                        <div className='h-6'>
                            {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}
                        </div>

                        <button className="mt-2 rounded-lg bg-linear-to-r from-green-400 to-lime-400 p-2 hover:from-green-500 hover:to-lime-600 transition duration-300">Save new password</button>
                    </form>
                </div>
            </div>
        </section>
    )
}