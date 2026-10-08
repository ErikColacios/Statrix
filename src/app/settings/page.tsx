'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog, Toast } from 'radix-ui'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { signIn } from 'next-auth/react'
import getUserInfo from '@/actions/getUserInfo'
import updateUser from '@/actions/updateUser'
import SettingsModals from '@/components/SettingsModals'
import getSessionUser from '@/actions/getSessionUser'
import updateUserAvatar from '@/actions/updateUserAvatar'
import updateUserBanner from '@/actions/updateUserBanner'

export default function Settings() {
    const router = useRouter()
    const [userInfo, setUserInfo] = useState<any[]>([])
    const [state, formAction] = useFormState<{ error?: string; success?: string }, FormData>(handleUpdateUser, { success: "Settings updated successfully", error: undefined })
    const [chooseMode, setChooseMode] = useState<'avatar' | 'banner' | 'deleteUser' | 'disconnectSteam'>('avatar')

    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({ avatar_id: 0, avatar_image: '', avatar_image_name: '' })
    const [selectedBanner, setSelectedBanner] = useState<Banner>({ banner_id: 0, banner_image: '', banner_image_name: '' })

    // Toast notification state
    const [open, setOpen] = useState(false)
    const timerRef = useRef(0)
    useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    useEffect(() => {
        const getUserInfoSession = async () => {
            const session = await getSessionUser()
            if (session) {
                const userInfo = await getUserInfo(session.user.name)
                setUserInfo(userInfo)
                setSelectedAvatar({
                    avatar_id: userInfo[0].avatar_image_id,
                    avatar_image: userInfo[0].avatar_image,
                    avatar_image_name: userInfo[0].avatar_image_name,
                })
                setSelectedBanner({
                    banner_id: userInfo[0].banner_image_id,
                    banner_image: userInfo[0].banner_image,
                    banner_image_name: userInfo[0].banner_image_name,
                })
            }
        }
        getUserInfoSession()
    }, [])

    async function handleConnectSteam() {
        // Redirect the user to the Steam login page
        router.push('/api/steam/login')
    }

    async function handleUpdateUser(prevState: { error?: string; success?: string }, formData: FormData) {
        // In case this is a Google user
        if (userInfo[0].user_google_id) {
            formData.set('userEmail', userInfo[0].user_email)
            const response = await updateUser(prevState, formData)
            if (response?.error) {
                return { error: response?.error }
            }
            if (userInfo[0].user_name !== formData.get('userName')) {
                await signIn('google')
            }
        } else {
            // Its NOT a Google user
            const response = await updateUser(prevState, formData)
            if (response?.error) {
                return { error: response?.error }
            }

            await signIn('credentials', {
                userNameLogIn: formData.get('userName'),
                trigger: 'updateUser',
                redirect: false,
            })
        }

        // Finally we update the avatar and banner images
        updateUserAvatar(selectedAvatar.avatar_id, selectedAvatar.avatar_image)
        updateUserBanner(selectedBanner.banner_id, selectedBanner.banner_image)

        return { success: 'Settings updated successfully' }
    }
    console.log("openToast", open)

    return userInfo.map((item: any, ident: number) => (
        <section className="relative w-full flex text-white justify-center py-20" key={ident}>
            <Toast.Provider>
                <Dialog.Root>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        <Dialog.Content
                            className={`fixed w-full p-2 md:w-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}
                        >
                            <SettingsModals
                                chooseMode={chooseMode}
                                selectedAvatar={selectedAvatar}
                                setSelectedAvatar={setSelectedAvatar}
                                selectedBanner={selectedBanner}
                                setSelectedBanner={setSelectedBanner}
                            />
                        </Dialog.Content>
                    </Dialog.Portal>
                    <div className="w-full md:w-4/5 lg:w-3/5 2xl:w-2/5 flex flex-col bg-gray-800 bg-zinc-900/80">
                        <form className="w-full relative rounded-sm outline-gray-700" action={formAction}>
                            {/* Banner image */}
                            <Dialog.Trigger asChild onClick={() => setChooseMode('banner')}>
                                <div className="w-full">
                                    <img
                                        src={'/bannerImages/' + selectedBanner.banner_image}
                                        className="w-full md:h-62 outline-solid outline-1 outline-gray-700 transition hover:outline-green-600 hover:opacity-70 cursor-pointer"
                                        alt="Banner image"
                                    />
                                </div>
                            </Dialog.Trigger>

                            {/* Avatar image */}
                            <Dialog.Trigger asChild onClick={() => setChooseMode('avatar')}>
                                <div className="bg-black ml-2 absolute top-15 w-28 h-28 sm:w-48 sm:h-48 rounded-full overflow-hidden outline-solid outline-1 outline-gray-700 hover:outline-green-600 cursor-pointer">
                                    <img
                                        src={'/avatarImages/' + selectedAvatar.avatar_image}
                                        className="h-full w-full object-cover transition hover:opacity-70"
                                        alt="Avatar image"
                                    />
                                </div>
                            </Dialog.Trigger>

                            <div className="flex flex-col gap-4 w-full px-4 pt-16 sm:pt-8">
                                <div className="ml-auto flex items-center space-x-4">
                                    <button
                                        onClick={() => {
                                            setOpen(false)
                                            window.clearTimeout(timerRef.current)
                                            timerRef.current = window.setTimeout(() => { setOpen(true) }, 100)
                                        }}
                                        className="text-sm text-white px-4 py-1 rounded-lg bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                                        Save changes
                                    </button>
                                </div>
                                <div>
                                    <p className="text-lg text-gray-400">User name</p>
                                    <input
                                        type="text"
                                        name="userName"
                                        maxLength={16}
                                        className="w-full p-1 rounded-lg bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_name}
                                    />
                                </div>
                                <div>
                                    <p className="text-lg text-gray-400">Bio</p>
                                    <textarea
                                        rows={4}
                                        name="userBio"
                                        maxLength={200}
                                        className="w-full p-1 rounded-lg bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-700 resize-none"
                                        defaultValue={item.user_bio}
                                    />
                                </div>
                                <div>
                                    <p className="text-lg text-gray-400">Email</p>
                                    <input
                                        type="userEmail"
                                        name="userEmail"
                                        maxLength={35}
                                        className="w-full rounded-lg p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_email}
                                    />
                                </div>
                                <div>
                                    <p className="text-lg text-gray-400">Location</p>
                                    <input
                                        type="text"
                                        name="userLocation"
                                        maxLength={35}
                                        className="w-full rounded-lg p-1 bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_location}
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-400 mt-4">Social links</h3>
                                <div className="flex items-center space-x-2 text-lg">
                                    <img src="/staticImages/icon_steam_gray.png" alt="Steam icon" className="w-8 h-8" />
                                    <p className="hidden sm:flex w-32">Steam</p>
                                    <input
                                        type="text"
                                        name="userSteam"
                                        maxLength={50}
                                        className="w-full p-1 rounded-lg bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_steam_url}
                                        placeholder="steamcommunity.com/id/yourSteamProfile"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <img src="/staticImages/icon_twitch_gray.png" alt="Twitch icon" className="w-8 h-8" />
                                    <p className="hidden sm:flex w-32 text-lg">Twitch</p>
                                    <input
                                        type="text"
                                        name="userTwitch"
                                        maxLength={50}
                                        className="w-full p-1 rounded-lg bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_twitch}
                                        placeholder="twitch.tv/yourTwitchChannel"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <img src="/staticImages/icon_x_gray.png" alt="X icon" className="w-8 h-8" />
                                    <p className="hidden sm:flex w-32 text-lg">X Account</p>
                                    <input
                                        type="text"
                                        name="userX"
                                        maxLength={50}
                                        className="w-full p-1 rounded-lg bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_x}
                                        placeholder="x.com/your-X-user"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <img src="/staticImages/icon_web_gray.png" alt="Web icon" className="w-8 h-8" />
                                    <p className="hidden sm:flex w-32 text-lg">Web Page</p>
                                    <input
                                        type="text"
                                        name="userWebpage"
                                        maxLength={50}
                                        className="w-full p-1 rounded-lg bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600"
                                        defaultValue={item.user_webpage}
                                        placeholder="your-site.com"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-400 mt-4">Connections</h3>
                                <div className="flex space-x-4 items-center">
                                    <img src="/staticImages/icon_steam_gray.png" alt="Steam icon" className="w-8 h-8" />
                                    <div className="flex flex-col">
                                        <p className="hidden sm:flex w-32 text-lg">Steam</p>
                                        <p className="text-gray-400 text-sm">Connect your Steam account to import your games</p>
                                    </div>

                                    {/* Connect Steam account */}
                                    {!userInfo[0].user_steam_id && (
                                        <button
                                            onClick={handleConnectSteam}
                                            className="ml-auto flex items-center space-x-1 rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">
                                            <svg width="16px" height="16px"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                stroke="#ffffff"
                                            ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">{' '}<path d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path>{' '}</g></svg>
                                            <p>Connect</p>
                                        </button>
                                    )}
                                    {/* Import Steam games */}
                                    {userInfo[0].user_steam_id && (
                                        <div className="flex ml-auto items-center space-x-2" id="steamConnected">
                                            <Link
                                                href="/importSteamGames"
                                                className="flex space-x-1 items-center text-white px-2 py-1 rounded-sm bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
                                            >
                                                <svg
                                                    width="18px"
                                                    height="18px"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        {' '}
                                                        <path
                                                            d="M12 14L11.2929 14.7071L12 15.4142L12.7071 14.7071L12 14ZM13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44771 11 5L13 5ZM6.29289 9.70711L11.2929 14.7071L12.7071 13.2929L7.70711 8.29289L6.29289 9.70711ZM12.7071 14.7071L17.7071 9.70711L16.2929 8.29289L11.2929 13.2929L12.7071 14.7071ZM13 14L13 5L11 5L11 14L13 14Z"
                                                            fill="#ffffff"
                                                        ></path>{' '}
                                                        <path
                                                            d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16"
                                                            stroke="#ffffff"
                                                            strokeWidth="2"
                                                        ></path>{' '}
                                                    </g>
                                                </svg>
                                                <p>Import</p>
                                            </Link>
                                            <Dialog.Trigger
                                                asChild
                                                onClick={() => setChooseMode('disconnectSteam')}
                                                className="ml-auto flex items-center space-x-1 rounded-sm text-gray-400 cursor-pointer border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800"
                                            >
                                                <p>Disconnect</p>
                                            </Dialog.Trigger>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-red-700 mt-8">Danger zone</h3>
                                <div className="">
                                    <p className="text-gray-400">Was created {item.user_creationdate.toLocaleDateString()}</p>
                                </div>
                                <div className="mb-8">
                                    <Dialog.Trigger onClick={() => setChooseMode('deleteUser')}>
                                        <span className="rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">
                                            Delete account
                                        </span>
                                    </Dialog.Trigger>
                                </div>
                            </div>
                        </form>
                    </div>
                </Dialog.Root>

                <Toast.Root className={`animate-slide-left flex flex-col fixed top-15 right-5 sm:right-15 text-white rounded shadow-green-500/30 border-green-600 p-2 
                    ${state?.error ? 'cardReviewRed' : state?.success ? 'cardReviewGreen' : ''}`} open={open} onOpenChange={setOpen}>
                    <Toast.Description asChild>
                        <div className="text-sm">
                            {/* Error message */}
                            {state?.error && <div className="flex items-center space-x-2">
                                <img src="/staticImages/icon_error_circle.png" alt="Error icon" className="w-5 h-5" />
                                <p>{state.error}</p></div>}
                            {/* Success message */}
                            {state?.success && <div className="flex items-center space-x-2">
                                <img src="/staticImages/icon_tick_circle.png" alt="Success icon" className="w-5 h-5" />
                                <p>{state.success}</p></div>}
                        </div>
                    </Toast.Description>
                    <Toast.Close />
                </Toast.Root>
                <Toast.Viewport />
            </Toast.Provider>
        </section>
    ))
}
