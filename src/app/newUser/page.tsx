"use client"
import React, { useState } from "react"
import updateUserName from "@/actions/updateUserName";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";
import { useRouter } from 'next/navigation'
import { Dialog } from "radix-ui";
import SettingsModals from "@/components/SettingsModals";
import updateUserBanner from "@/actions/updateUserBanner";
import updateUserAvatar from "@/actions/updateUserAvatar";

export default function NewUser() {

    const router = useRouter()
    const session: any = useSession()
    const [state, formAction] = useFormState<any, FormData>(handleUpdateUserName, undefined)
    const [chooseMode, setChooseMode] = useState<"avatar" | "banner" | "deleteUser">("avatar")
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({ avatar_id: 1, avatar_image: "vault_boy.jpg", avatar_image_name: "Vault boy" })
    const [selectedBanner, setSelectedBanner] = useState<Banner>({ banner_id: 1, banner_image: "fallout_workshop.jpg", banner_image_name: "Fallout workshop" })

    async function handleUpdateUserName(prevState: any, formData: FormData) {
        const userName = formData.get("usernameLogIn") as string;

        if (userName === "")
            return { error: "User name cannot be empty" }

        if (userName.includes(" ")) {
            return { error: "User name cannot contain white spaces" }
        }

        const userId: string = session.data.user.id;

        const response = await updateUserName(formData, userId)

        // Also update the avatar and banner images
        await updateUserAvatar(selectedAvatar.avatar_id, selectedAvatar.avatar_image)
        await updateUserBanner(selectedBanner.banner_id, selectedBanner.banner_image)

        if (response.error) {
            return { error: response.error }
        } else {
            session.update({ name: userName })
            router.push("/")
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className={`fixed w-full p-2 md:w-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                    <Dialog.Title className="DialogTitle"></Dialog.Title>
                    <Dialog.Description className="DialogDescription"></Dialog.Description>
                    <SettingsModals chooseMode={chooseMode} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} selectedBanner={selectedBanner} setSelectedBanner={setSelectedBanner} />
                </Dialog.Content>
            </Dialog.Portal>
            <div className="w-full lg:w-3/5 2xl:w-2/5 flex flex-col items-center justify-center bg-zinc-900 border border-gray-600 rounded-lg text-center overflow-hidden">
                {/* <img src="/staticImages/bg_nightcity.jpg" alt="Welcome banner" className="w-full h-full border-b border-gray-600" /> */}
                <Dialog.Trigger asChild onClick={() => setChooseMode("banner")}>
                    <div className="w-full">
                        <img src={"/bannerImages/" + selectedBanner.banner_image} className="w-full h-42 md:h-62 outline-solid outline-1 outline-gray-700 transition hover:outline-green-600 hover:opacity-70 cursor-pointer" alt="Banner image" />
                    </div>
                </Dialog.Trigger>
                <div className="flex flex-col items-center my-10">
                    <Dialog.Trigger asChild onClick={() => setChooseMode("avatar")}>
                        <div className="w-32 h-32 rounded-full overflow-hidden outline-solid outline-1 outline-gray-700 transition hover:outline-green-600 hover:opacity-70 cursor-pointer">
                            <img src={"/avatarImages/" + selectedAvatar.avatar_image} className="h-full w-full object-cover" alt="Avatar image" />
                        </div>
                    </Dialog.Trigger>
                    <h1 className="text-4xl font-bold">Welcome aboard!</h1>
                    <p className="mb-4">What is your user name?</p>
                    <form action={formAction}>
                        <input type="text" maxLength={16} name="usernameLogIn" id="usernameLogIn" className="text-center mb-4 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600 p-1 focus:outline-hidden" placeholder="Your username" />
                        {/* Show error message */}
                        {state?.error && <p className='text-red-500 text-sm mb-2'>{state.error}</p>}

                        <p className="text-sm text-gray-400 mb-4">This can be changed anytime in your Settings page</p>

                        <button type="submit" className="text-md sm:text-lg text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Continue</button>
                    </form>
                </div>
            </div>
        </Dialog.Root>
    )
}