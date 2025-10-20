"use client"
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import updateUser from "@/actions/updateUser";
import ChooseAvatarBanner from "@/components/ChooseAvatarBanner";
import PrimaryButton from "@/components/PrimaryButton";
import { Dialog } from 'radix-ui';
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function Settings(){

    const [userInfo, setUserInfo] = useState([])
    const [state, formAction] = useFormState<any, FormData>(updateUser, undefined)
    let userInf:any | undefined = []
    const [chooseMode, setChooseMode] = useState<"avatar" | "banner">("avatar")

    useEffect(() => {
        const getSessionUserId = async () => {
            const user = await getSessionUser()
            if(user !== undefined){
                userInf = await getUserInfo(user.user_name)
                setUserInfo(userInf)
            }
        }
        getSessionUserId()
    }, [])


    return (
        userInfo.map((item:any, ident:number) => (

        <section className="relative w-full flex bg-black text-white justify-center py-20 bg-gradient-to-b from-black via-gray-900 to-black" key={ident}>
        <Dialog.Root>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed w-full p-2 md:w-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                    <Dialog.Title className="DialogTitle"></Dialog.Title>
                    <Dialog.Description className="DialogDescription"></Dialog.Description>
                        <ChooseAvatarBanner chooseMode={chooseMode} current_avatar_id={item.avatar_image_id} current_banner_id={item.banner_image_id} />
                </Dialog.Content>
            </Dialog.Portal>
            <div className="w-full md:w-4/5 lg:w-3/5 2xl:w-2/5 flex flex-col bg-gray-800 bg-zinc-900/80">
                <form className="w-full relative rounded  outline-gray-700" action={formAction}>

                        {/* BANNER */}
                        <Dialog.Trigger asChild onClick={() => setChooseMode("banner")}>
                            <div className="w-full">
                                <img src={"/bannerImages/"+item.banner_image} className="w-full h-42 md:h-56 outline outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer" />
                            </div>
                        </Dialog.Trigger>
        
        
                        {/* AVATAR */}
                        <Dialog.Trigger asChild onClick={() => setChooseMode("avatar")}>
                            <div className="ml-2 absolute top-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden outline outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer">
                                <img src={"/avatarImages/" + item.avatar_image} className="h-full w-full object-cover" />
                            </div>
                        </Dialog.Trigger>
                        
                            <div className="w-full px-4 pt-16 sm:pt-8">
                                <div>
                                    <p className="text-sm text-gray-400">Username</p>
                                    <input type="text" name="user_name" maxLength={20} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_name} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Bio</p>
                                    <textarea rows={7} name="user_bio" className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-700 resize-none" defaultValue={item.user_bio} maxLength={250} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Email</p>
                                    <input type="email" name="user_email" maxLength={35} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_email} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Location</p>
                                    <input type="text" name="user_location" maxLength={35} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_location} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Webpage</p>
                                    <input type="text" name="user_webpage" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_webpage} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Steam Profile</p>
                                    <input type="text" name="user_steam" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_steam} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Twitch Profile</p>
                                    <input type="text" name="user_twitch" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_twitch} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">X Profile</p>
                                    <input type="text" name="user_x" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_x} />
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-400">Was created {item.user_creationdate.toLocaleDateString()}</p>
                                </div>
        
                                <div className="py-6 flex flex-col items-center">
                                    <PrimaryButton text="Save changes"/>
                                    <div className="h-8">
                                        {/* Error message */}
                                        {state?.error && <p className='text-red-500'>{state.error}</p>}
                                        {/* Success message */}
                                        {state && <p className='text-sm mt-4 lg:text-base text-green-500'>{state}</p>}
                                    </div>
                                </div>
                            </div>
                    </form>
                </div>
            </Dialog.Root>
        </section>
        ))
    )
}