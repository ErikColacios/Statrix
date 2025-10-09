"use client"
import React, { useState } from "react"
import { useFormState } from "react-dom"
import updateUser from "../actions/updateUser"
import ChooseAvatar from "./ChooseAvatar"
import ChooseBanner from "./ChooseBanner"
import PrimaryButton from "./PrimaryButton"
import { Dialog } from "radix-ui"

export default function UserSettingsForm({ userInfo }: any) {

    const [state, formAction] = useFormState<any, FormData>(updateUser, undefined)
    const [chooseAvatarOpened, setChooseAvatarOpened] = useState<boolean>(false)
    const [chooseBannerOpened, setChooseBannerOpened] = useState<boolean>(false)

    return (
        <>
            <form className="w-full relative rounded  outline-gray-700" action={formAction}>

                    {/* BANNER */}
                <Dialog.Trigger asChild>
                    <div className="w-full" onClick={() => setChooseBannerOpened(true)}>
                        <img src={"/bannerImages/aperture.jpg"} className="w-full h-56 outline outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer" />
                    </div>
                </Dialog.Trigger>


                    {/* AVATAR */}
                    <Dialog.Trigger asChild>
                    <div className="ml-2 absolute top-10 w-48 h-48 rounded-full overflow-hidden outline outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer" onClick={() => setChooseAvatarOpened(true)}>
                        <img src={"/avatarImages/leon.jpg"} className="h-full w-full object-cover" />
                    </div>
                    </Dialog.Trigger>

                    <div className="w-full px-4 py-8">
                        <div>
                            <p>Username</p>
                            <input type="text" name="user_name" maxLength={20} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={'erik'} />
                        </div>
                        <div className="mt-4">
                            <p>Bio</p>
                            <textarea rows={7} name="user_bio" className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-700 resize-none" defaultValue={'Welcome to my profile'} maxLength={250} />
                        </div>
                        <div className="mt-4">
                            <p>Email</p>
                            <input type="email" name="user_email" maxLength={35} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={'erikcolacios@gmail.com'} />
                        </div>
                        <div className="mt-4">
                            <p>Location</p>
                            <input type="text" name="user_location" maxLength={35} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={'Barcelona Spain'} />
                        </div>
                        <div className="mt-4">
                            <p>Webpage</p>
                            <input type="text" name="user_webpage" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={'www.erikcolacios.com'} />
                        </div>
                        <div className="mt-4">
                            <p>Steam Profile</p>
                            <input type="text" name="user_steam" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={''} />
                        </div>
                        <div className="mt-4">
                            <p>Twitch Profile</p>
                            <input type="text" name="user_twitch" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={''} />
                        </div>
                        <div className="mt-4">
                            <p>X Profile</p>
                            <input type="text" name="user_x" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={''} />
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-400">Was created </p>
                        </div>

                        <div className="py-6 flex flex-col lg:flex-row items-center">
                            <PrimaryButton text="Save changes"/>
                            <div className="h-8">
                                {/* Error message */}
                                {state?.error && <p className='text-red-500'>{state.error}</p>}
                                {/* Success message */}
                                {state && <p className='text-sm mt-1 lg:text-base text-green-500'>{state}</p>}
                            </div>
                        </div>
                    </div>
            </form>
        </>
    )
}