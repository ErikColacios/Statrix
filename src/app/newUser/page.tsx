"use client"
import React, { useEffect } from "react"
import { redirect } from "next/navigation";
import updateUserName from "@/actions/updateUserName";
import { signIn, useSession } from "next-auth/react";
import { useFormState } from "react-dom";

export default function newUser() {

    const [state, formAction] = useFormState<any, FormData>(handleUpdateUserName, undefined)
    
    const session:any = useSession()
    console.log(session)

    if(!session){
        redirect("/login")
    }

    useEffect(() => {
      if(session.status === "unauthenticated") {
        redirect("/login")
      }
    }, [session.data])
    
    async function handleUpdateUserName(prevState: any, formData: FormData) {
        const userName = formData.get("usernameLogIn") as string;
        console.log(session)
        if (userName === "")
            return { error: "User name cannot be empty" }

        const userId:string = session.data.user.id;

        const response = await updateUserName(formData, userId)

        if(response.error) {
            return { error: response.error }
        } else {
            signIn('google', { callbackUrl: '/' });
        }
    }

    return (
        <div className="text-white flex flex-col items-center justify-center h-screen p-4 md:p-12">
            <div className="w-full lg:w-3/5 2xl:w-2/5 flex flex-col items-center justify-center bg-zinc-900 rounded-lg text-center overflow-hidden">
                <img src="/staticImages/nightcity.jpg" alt="Welcome banner" className="w-full h-full" />
                <div className="flex flex-col space-y-4 mt-12 mb-16">
                    <h1 className="text-4xl font-bold">Welcome aboard!</h1>
                    <p className="mb-4">What is your user name?</p>
                    <form action={formAction}>
                        <input type="text" maxLength={16} name="usernameLogIn" id="usernameLogIn" className="text-center mb-4 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 p-1 focus:outline-none" placeholder="DoomGuy"/>
                        {/* Show error message */}
                        {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}

                        <p className="text-sm text-gray-400 mb-4">This can be changed anytime in your Settings page</p>
                        <button type="submit" className="text-md sm:text-lg text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Continue</button>
                    </form>
                </div>
            </div>
        </div>
    )
}