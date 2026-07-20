"use client"
import React from "react";
import getUserInfo from "@/actions/getUserInfo";
import updateUser from "@/actions/updateUser";
import SettingsModals from "@/components/SettingsModals";
import PrimaryButton from "@/components/PrimaryButton";
import getSessionUser from "@/actions/getSessionUser";
import { Dialog } from 'radix-ui';
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { signIn } from "next-auth/react";
import updateUserAvatar from "@/actions/updateUserAvatar";
import updateUserBanner from "@/actions/updateUserBanner";

export default function Settings() {

    const [userInfo, setUserInfo] = useState<any[]>([])
    const [state, formAction] = useFormState<any, FormData>(handleUpdateUser, undefined)
    const [chooseMode, setChooseMode] = useState<"avatar" | "banner" | "deleteUser">("avatar")

    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({ avatar_id: 0, avatar_image: "", avatar_image_name: "" })
    const [selectedBanner, setSelectedBanner] = useState<Banner>({ banner_id: 0, banner_image: "", banner_image_name: "" })

    useEffect(() => {
        const getUserInfoSession = async () => {
            const session = await getSessionUser()
            if (session) {
                const userInfo = await getUserInfo(session.user.name)
                setUserInfo(userInfo)
                setSelectedAvatar({ avatar_id: userInfo[0].avatar_image_id, avatar_image: userInfo[0].avatar_image, avatar_image_name: userInfo[0].avatar_image_name })
                setSelectedBanner({ banner_id: userInfo[0].banner_image_id, banner_image: userInfo[0].banner_image, banner_image_name: userInfo[0].banner_image_name })
            }
        }
        getUserInfoSession()
    }, [])

    async function handleUpdateUser(prevState: any, formData: FormData) {
        // In case this is a Google user
        if (userInfo[0].user_google_id) {
            formData.set("userEmail", userInfo[0].user_email)
            const response = await updateUser(prevState, formData)
            if (response?.error) {
                return { error: response?.error }
            }
            if (userInfo[0].user_name !== formData.get("userName")) {
                await signIn('google');
            }

        } else {
            // Its NOT a Google user
            const response = await updateUser(prevState, formData)
            if (response?.error) {
                return { error: response?.error }
            }

            await signIn("credentials", {
                userNameLogIn: formData.get("userName"),
                trigger: "updateUser",
                redirect: false
            })
        }

        // Finally we update the avatar and banner images
        updateUserAvatar(selectedAvatar.avatar_id, selectedAvatar.avatar_image)
        updateUserBanner(selectedBanner.banner_id, selectedBanner.banner_image)


        return { success: "Settings updated succesfully!" }
    }

    return (
        userInfo.map((item: any, ident: number) => (
            <section className="relative w-full flex text-white justify-center py-20" key={ident}>
                <Dialog.Root>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        <Dialog.Content className={`fixed w-full p-2 md:w-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                            <SettingsModals chooseMode={chooseMode} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} selectedBanner={selectedBanner} setSelectedBanner={setSelectedBanner} />
                        </Dialog.Content>
                    </Dialog.Portal>
                    <div className="w-full md:w-4/5 lg:w-3/5 2xl:w-2/5 flex flex-col bg-gray-800 bg-zinc-900/80">
                        <form className="w-full relative rounded-sm outline-gray-700" action={formAction}>

                            {/* Banner image */}
                            <Dialog.Trigger asChild onClick={() => setChooseMode("banner")}>
                                <div className="w-full">
                                    <img src={"/bannerImages/" + selectedBanner.banner_image} className="w-full h-42 md:h-62 outline-solid outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer" alt="Banner image" />
                                </div>
                            </Dialog.Trigger>


                            {/* Avatar image */}
                            <Dialog.Trigger asChild onClick={() => setChooseMode("avatar")}>
                                <div className="ml-2 absolute top-15 w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden outline-solid outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer">
                                    <img src={"/avatarImages/" + selectedAvatar.avatar_image} className="h-full w-full object-cover" alt="Avatar image" />
                                </div>
                            </Dialog.Trigger>

                            <div className="flex flex-col gap-4 w-full px-4 pt-16 sm:pt-8">
                                <div>
                                    <p className="text-sm text-gray-400">Username</p>
                                    <input type="text" name="userName" maxLength={16} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_name} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Bio</p>
                                    <textarea rows={7} name="userBio" maxLength={200} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-700 resize-none" defaultValue={item.user_bio} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <input type="userEmail" name="userEmail" maxLength={35} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_email} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <input type="text" name="userLocation" maxLength={35} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_location} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Webpage</p>
                                    <input type="text" name="userWebpage" maxLength={50} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_webpage} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Steam Profile</p>
                                    <input type="text" name="userSteam" maxLength={50} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_steam} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Twitch Profile</p>
                                    <input type="text" name="userTwitch" maxLength={50} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_twitch} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">X Profile</p>
                                    <input type="text" name="userX" maxLength={50} className="w-full p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" defaultValue={item.user_x} />
                                </div>
                                <div>
                                    <p className="text-gray-400">Was created {item.user_creationdate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Dialog.Trigger onClick={() => setChooseMode("deleteUser")}>
                                        <span className="rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">Delete account</span>
                                    </Dialog.Trigger>
                                </div>

                                <div className="py-6 flex flex-col items-center">
                                    <PrimaryButton text="Save changes" />
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