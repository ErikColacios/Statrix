"use client"
import React, { useEffect, useState } from "react"
import updateUserName from "@/actions/updateUserName"
import { useSession } from "next-auth/react"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import updateUserBanner from "@/actions/updateUserBanner"
import updateUserAvatar from "@/actions/updateUserAvatar"

export default function NewUser() {
    const router = useRouter()
    const session: any = useSession()
    const [state, formAction] = useFormState<any, FormData>(handleUpdateUser, { success: undefined, error: undefined })

    const [selectedAvatar, setSelectedAvatar] = useState<File>()
    const [avatarUrl, setAvatarUrl] = useState("/avatarImages/avatar_default.jpg")

    const [selectedBanner, setSelectedBanner] = useState<File>()
    const [bannerUrl, setBannerUrl] = useState("/bannerImages/fallout_workshop.jpg")


    function validateImage(file: File | undefined) {
        if (!file) return false
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size >= 1500000) {
            console.log("Image must be JPG, PNG or WebP and smaller than 1.5 MB")
            return false
        }
        return true
    }

    function handleInputAvatar(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (validateImage(file)){
            setSelectedAvatar(file)
        } else {
            state.error = "Image must be JPG, PNG or WebP and smaller than 1.5 MB"
            const avatarFile = document.getElementById("avatarFile") as HTMLInputElement
            avatarFile.value = ""
        }
    }

    function handleInputBanner(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (validateImage(file)){
            setSelectedBanner(file)
        } else {
            state.error = "Image must be JPG, PNG or WebP and smaller than 1.5 MB"
            const bannerFile = document.getElementById("bannerFile") as HTMLInputElement
            bannerFile.value = ""
        }
    }

    useEffect(() => {
        if (!selectedAvatar) return
        let cancelled = false
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result && !cancelled) setAvatarUrl(String(e.target.result))
        }
        reader.readAsDataURL(selectedAvatar)
        return () => {
            cancelled = true
            if (reader.readyState === 1) reader.abort()
        }
    }, [selectedAvatar])

    useEffect(() => {
        if (!selectedBanner) return
        let cancelled = false
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result && !cancelled) setBannerUrl(String(e.target.result))
        }
        reader.readAsDataURL(selectedBanner)
        return () => {
            cancelled = true
            if (reader.readyState === 1) reader.abort()
        }
    }, [selectedBanner])

    // Save the user settings
    async function handleUpdateUser(prevState: { error?: string; success?: string }, formData: FormData) {
        const userName = formData.get("usernameLogIn") as string
        if (!userName.trim()) return { error: "User name cannot be empty" }
        if (userName.includes(" ")) return { error: "User name cannot contain white spaces" }
        if (!session.data?.user?.id) return { error: "Your session could not be verified. Please try again." }

        const response = await updateUserName(formData, session.data.user.id)
        if (response?.error) {
            return { error: response?.error }
        } else {
            // Finally we update the avatar and banner images
            await updateUserAvatar(formData)
            await updateUserBanner(formData)

            // And update the session name
            await session.update({ name: userName })
            router.push("/community")
            return { success: true }
        }
    }

    return (
        <main className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden px-4 py-10 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-lime-500/5 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.65)_75%)]" />
            </div>

            <form action={formAction} className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl shadow-black/40">
                <div className="relative h-40 w-full sm:h-56">
                    <img src={bannerUrl} className="h-full w-full object-cover" alt="Profile banner preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/25 to-black/10" />
                    <label className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white backdrop-blur transition hover:border-green-400/60 hover:bg-black/70">
                        <span aria-hidden="true">✦</span> Change banner
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" id="bannerFile" name="bannerFile" onChange={handleInputBanner} />
                    </label>
                    <div className="absolute bottom-0 left-6 translate-y-1/2 sm:left-10">
                        <label className="group relative block h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-zinc-900 bg-zinc-800 shadow-xl sm:h-32 sm:w-32">
                            <img src={avatarUrl} alt="Profile avatar preview" className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-60" />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold opacity-0 transition group-hover:opacity-100">Change</span>
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" id="avatarFile" name="avatarFile" onChange={handleInputAvatar} />
                        </label>
                    </div>
                </div>

                <div className="px-6 pb-8 pt-16 sm:px-10 sm:pb-10 sm:pt-20">
                    <div className="mb-8 max-w-xl">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome aboard!</h1>
                        <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">Choose a username and customize your profile. You can change these details and more in Settings.</p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="usernameLogIn" className="text-sm font-medium text-zinc-200">Username</label>
                            <input type="text" maxLength={16} name="usernameLogIn" id="usernameLogIn" autoComplete="username" required className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/15" placeholder="Choose a username" />
                            <p className="text-xs text-zinc-500">Up to 16 characters. Spaces aren't allowed.</p>
                        </div>

                        {state?.error && <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</div>}

                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-zinc-500">JPG, PNG or WebP · Max. 1.5 MB per image</p>
                            <button type="submit" className="text-sm text-white px-4 py-2 rounded-lg bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Create profile</button>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}