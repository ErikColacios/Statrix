"use client"
import React, { useState } from "react"
import { useFormState } from "react-dom"
import { User } from "../types/User"
import updateUser from "../actions/updateUser"

export default function UserSettingsForm({userInfo}:any){

    const [state, formAction] = useFormState<any, FormData>(updateUser, undefined)

    return (
        <div>
            <form className="flex flex-col lg:flex-row mt-8" action={formAction}>
                <div className="lg:mr-8">
                    {userInfo.map((item:any, index:number)=>(
                        <div key={index} className="w-full lg:w-96">
                            <div className="h-8">
                                {/* Error message */}
                                {state?.error && <p className='text-red-500'>{state.error}</p>}
                                {/* Success message */}
                                {state && <p className='text-green-500'>{state}</p>}
                            </div>
                                <div>
                                <p>Username</p>
                                <input type="text" name="user_name" maxLength={20} className="w-full p-1 bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_name}/>
                            </div>
                            <div className="mt-4">
                                <p>Bio</p>
                                <textarea rows={7} name="user_bio" className="w-full p-1 bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600 resize-none" defaultValue={item.user_bio} maxLength={250}/>
                            </div>
                            <div className="mt-4">
                                <p>Email</p>
                                <input type="email" name="user_email" maxLength={35} className="w-full p-1 bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_email}/>
                            </div>
                            <div className="mt-4">
                                <p>Location</p>
                                <input type="text" name="user_location" maxLength={35} className="w-full p-1 bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_location}/>
                            </div>
                            <div className="mt-4">
                                <p>Webpage</p>
                                <input type="text" name="user_webpage" maxLength={50} className="w-full p-1 bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_webpage}/>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-400">Was created {item.user_creationdate}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full flex flex-col lg:items-center lg:text-center mt-12 lg:mt-0">
                    <div>
                        <p className="mb-2">Choose your avatar</p>
                        <div className="w-48 h-48 rounded-full overflow-hidden border border-green-600">
                            <img src="/profileImages/leon.jpg" className="h-full w-full object-cover"/>
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="mb-2">Choose your banner</p>
                        <img src="/staticImages/eldenring.jpg" className="border border-green-600"/>
                    </div>
                </div>
            </form>
            <div className="mt-8">
                <button type="submit" className="p-2 text-center text-lg bg-green-500 hover:bg-green-600">Save changes</button>
            </div>
        </div>
    )
}