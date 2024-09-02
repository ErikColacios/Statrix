"use client"
import React, { useState } from "react"
import { useFormState } from "react-dom"
import updateUser from "../actions/updateUser"
import ChooseAvatar from "./ChooseAvatar"
import ChooseBanner from "./ChooseBanner"

export default function UserSettingsForm({userInfo}:any){

    const [state, formAction] = useFormState<any, FormData>(updateUser, undefined)
    const [chooseAvatarOpened, setChooseAvatarOpened] = useState<boolean>(false)
    const [chooseBannerOpened, setChooseBannerOpened] = useState<boolean>(false)


    return (
        <>
            {userInfo.map((item:any, index:number)=>(
            <form className="relative flex flex-col lg:flex-row pb-24" action={formAction} key={index}>
                {chooseAvatarOpened && <ChooseAvatar currentAvatarId={item.user_avatar_id} handleClose={()=>setChooseAvatarOpened(!chooseAvatarOpened)} userId={item.user_id} />}
                {chooseBannerOpened && <ChooseBanner currentBannerId={item.user_banner_id} handleClose={()=>setChooseAvatarOpened(!chooseAvatarOpened)} userId={item.user_id} />}
    
                    <div className="lg:mr-8" >
                            <div  className="w-full lg:w-96">
                                    <div>
                                    <p>Username</p>
                                    <input type="text" name="user_name" maxLength={20} className="w-full p-1 bg-gray-700 outline-none border border-2 border-gray-700 focus:border-green-600" defaultValue={item.user_name}/>
                                </div>
                                <div className="mt-4">
                                    <p>Bio</p>
                                    <textarea rows={7} name="user_bio" className="w-full p-1 bg-gray-700 outline-none border border-2 border-gray-700 focus:border-green-700 resize-none" defaultValue={item.user_bio} maxLength={250}/>
                                </div>
                                <div className="mt-4">
                                    <p>Email</p>
                                    <input type="email" name="user_email" maxLength={35} className="w-full p-1 bg-gray-700 outline-none border border-2 border-gray-700 focus:border-green-600" defaultValue={item.user_email}/>
                                </div>
                                <div className="mt-4">
                                    <p>Location</p>
                                    <input type="text" name="user_location" maxLength={35} className="w-full p-1 bg-gray-700 outline-none border border-2 border-gray-700 focus:border-green-600" defaultValue={item.user_location}/>
                                </div>
                                <div className="mt-4">
                                    <p>Webpage</p>
                                    <input type="text" name="user_webpage" maxLength={50} className="w-full p-1 bg-gray-700 outline-none border border-2 border-gray-700 focus:border-green-600" defaultValue={item.user_webpage}/>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-400">Was created {item.user_creationdate}</p>
                                </div>
                            </div>
                    </div>

                <div className="w-full flex flex-col justify-center lg:items-center lg:text-center mt-12 lg:mt-0">
                    {/* AVATAR */}
                    <div>
                        <p className="mb-2">Change your avatar</p>
                        <div className="w-48 h-48 rounded-full overflow-hidden outline outline-2 outline-green-600 hover:outline-4 cursor-pointer" onClick={() => setChooseAvatarOpened(true)}>
                            <img src={"/profileImages/"+item.avatar_images.avatar_image} className="h-full w-full object-cover"/>
                        </div>
                    </div>
                    {/* BANNER */}
                    <div className="w-full flex flex-col lg:items-center mt-8" onClick={() => setChooseBannerOpened(true)}>
                        <p className="mb-2">Change your banner</p>
                        <img src={"/bannerImages/"+item.banner_images.banner_image} className="w-[35rem] lg:h-56 outline outline-2 outline-green-600 hover:outline-4 cursor-pointer"/>
                    </div>
                </div>
                <div className="absolute flex flex-col lg:flex-row items-center bottom-0">
                    <button type="submit" className="p-2 pl-4 pr-4 mr-7 text-lg bg-green-500 hover:bg-green-600">Save changes</button>
                    <div className="h-8">
                        {/* Error message */}
                        {state?.error && <p className='text-red-500'>{state.error}</p>}
                        {/* Success message */}
                        {state && <p className='text-sm mt-1 lg:text-base text-green-500'>{state}</p>}
                    </div>
                </div>
            </form>
            ))}
        </>
    )
}