"use client"
import React from "react";
import getUserInfo from "@/actions/getUserInfo";
import updateUser from "@/actions/updateUser";
import SettingsModals from "@/components/SettingsModals";
import PrimaryButton from "@/components/PrimaryButton";
import { Dialog } from 'radix-ui';
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import getSessionUser from "@/actions/getSessionUser";
import { signIn } from "next-auth/react";

export default function Settings() {

    const [userInfo, setUserInfo] = useState<any[]>([])
    const [state, formAction] = useFormState<any, FormData>(handleUpdateUser, undefined)
    const [chooseMode, setChooseMode] = useState<"avatar" | "banner" | "deleteUser">("avatar")

    useEffect(() => {
        const getUserInfoSession = async () => {
            const session = await getSessionUser()
            if(session){
                setUserInfo(await getUserInfo(session.user.name))
            }
        }
        getUserInfoSession()
    }, [])

    async function handleUpdateUser(prevState: any, formData: FormData) {
        // In case this is a Google user
        if(userInfo[0].user_google_id) {

            formData.set("userEmail", userInfo[0].user_email)
            const response = await updateUser(prevState, formData)
            if(response?.error) {
                return { error: response?.error }
            }

            await signIn('google');
        } else {
            // Its NOT a Google user
            const response = await updateUser(prevState, formData)
            if(response?.error) {
                return { error: response?.error }
            }

            await signIn("credentials", {
                userNameLogIn: formData.get("userName"),
                trigger: "updateUser",
                redirect: false
            })
        }
        return { success: "Settings updated succesfully!" }
    }

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
                        <SettingsModals chooseMode={chooseMode} currentAvatarId={item.avatar_image_id} currentBannerId={item.banner_image_id} />
                </Dialog.Content>
            </Dialog.Portal>
            <div className="w-full md:w-4/5 lg:w-3/5 2xl:w-2/5 flex flex-col bg-gray-800 bg-zinc-900/80">
                <form className="w-full relative rounded outline-gray-700" action={formAction}>

                        {/* BANNER */}
                        <Dialog.Trigger asChild onClick={() => setChooseMode("banner")}>
                            <div className="w-full">
                                <img src={"/bannerImages/"+item.banner_image} className="w-full h-42 md:h-56 outline outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer" alt="Banner image"/>
                            </div>
                        </Dialog.Trigger>
        
        
                        {/* AVATAR */}
                        <Dialog.Trigger asChild onClick={() => setChooseMode("avatar")}>
                            <div className="ml-2 absolute top-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden outline outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer">
                                <img src={"/avatarImages/" + item.avatar_image} className="h-full w-full object-cover" alt="Avatar image"/>
                            </div>
                        </Dialog.Trigger>
                        
                            <div className="flex flex-col gap-4 w-full px-4 pt-16 sm:pt-8">
                                <div>
                                    <p className="text-sm text-gray-400">Username</p>
                                    <input type="text" name="userName" maxLength={16} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_name} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Bio</p>
                                    <textarea rows={7} name="userBio" maxLength={250} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-700 resize-none" defaultValue={item.user_bio} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <input type="userEmail" name="userEmail" maxLength={35} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_email} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <input type="text" name="userLocation" maxLength={35} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_location} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Webpage</p>
                                    <input type="text" name="userWebpage" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_webpage} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Steam Profile</p>
                                    <input type="text" name="userSteam" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_steam} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Twitch Profile</p>
                                    <input type="text" name="userTwitch" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_twitch} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">X Profile</p>
                                    <input type="text" name="userX" maxLength={50} className="w-full p-1 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600" defaultValue={item.user_x} />
                                </div>
                                <div>
                                    <p className="text-gray-400">Was created {item.user_creationdate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Dialog.Trigger onClick={() => setChooseMode("deleteUser")}>
                                        <span className="rounded text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">Delete account</span>
                                    </Dialog.Trigger>
                                </div>
        
                                <div className="py-6 flex flex-col items-center">
                                    <PrimaryButton text="Save changes"/>
                                    <div className="text-sm h-8">
                                        {/* Error message */}
                                        {state?.error && <p className='text-red-500 mt-2'>{state.error}</p>}
                                        {/* Success message */}
                                        {state?.success && <p className='text-green-500 mt-2'>{state.success}</p>}
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