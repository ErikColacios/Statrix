"use client"
import React, { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { deleteUser } from "@/actions/deleteUser";
import { logOutUser } from "@/actions/logOutUser";
import updateUserSteamId from "@/actions/updateUserSteamId";


interface SettingsModalsProps {
  chooseMode?: "avatar" | "banner" | "deleteUser" | "disconnectSteam";
}

export default function SettingsModals({ chooseMode }: SettingsModalsProps) {

  // Avatar images
  const [avatarImages, setAvatarImages] = useState([])

  // Banner images
  const [bannerImages, setBannerImages] = useState([])

  const [errorMessage, setErrorMessage] = useState("")


  // function handleSelectAvatar(avatar_image_id: number, avatar_image: string, avatar_image_name: string) {

  //   // First we remove the previous avatar div outlined
  //   let avatarDivPrevious: HTMLDivElement = document.getElementById(`avatar${selectedAvatar.avatar_id}`) as HTMLDivElement
  //   avatarDivPrevious.style.outline = "none"

  //   // Then we select the new avatar div and we outline it
  //   setSelectedAvatar({ avatar_id: avatar_image_id, avatar_image: avatar_image, avatar_image_name: avatar_image_name })

  //   let avatarDiv: HTMLDivElement = document.getElementById(`avatar${avatar_image_id}`) as HTMLDivElement
  //   if (avatarDiv != null) {
  //     avatarDiv.style.outline = "5px solid #00ff3c"
  //   }
  // }

  // function handleSelectBanner(banner_image_id: number, banner_image: string, banner_image_name: string) {

  //   // First we remove the previous banner div outlined
  //   let bannerDivPrevious: HTMLDivElement = document.getElementById(`banner${selectedBanner.banner_id}`) as HTMLDivElement
  //   bannerDivPrevious.style.outline = "none"

  //   // Then we select the new banner div and we outline it
  //   setSelectedBanner({ banner_id: banner_image_id, banner_image: banner_image, banner_image_name: banner_image_name })

  //   let bannerDiv: HTMLDivElement = document.getElementById(`banner${banner_image_id}`) as HTMLDivElement
  //   if (bannerDiv != null) {
  //     bannerDiv.style.outline = "5px solid #00ff3c"
  //   }
  // }


  async function handleDeleteAccount() {
    try {
      let deleteAccountInput: HTMLInputElement = document.getElementById('deleteAccountInput') as HTMLInputElement

      const response = await deleteUser(deleteAccountInput.value as string)
      if (response?.error) {
        setErrorMessage(response?.error)
        return;
      }
      await logOutUser()
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function handleDisconnectSteam() {
    // Sets the user's steam id to null in the database, effectively disconnecting their Steam account
    await updateUserSteamId(null)
    document.getElementById("steamConnected")?.remove()
  }



  const closeButton = (
    <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    </Dialog.Close>
  )

  const errorBlock = errorMessage &&
    <p className="flex items-center gap-2 text-sm text-rose-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
      {errorMessage}
    </p>

  if (chooseMode === "deleteUser") {
    return (
      <div className="relative w-full max-w-2xl mx-auto border border-rose-500/30 rounded-2xl bg-zinc-950 text-white shadow-2xl">

        {/* Subtle red glow backdrop */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl" />
        </div>

        {closeButton}

        <div className="relative flex flex-col gap-6 px-4 py-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 pr-10">
            <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-rose-500/15 text-rose-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Delete account</h2>
              <p className="text-sm text-zinc-400">Are you sure you want to delete this account?</p>
            </div>
          </div>

          {/* What will be erased */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-sm text-zinc-300">All your data will be erased and cannot be recovered:</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-300">
              {["Game data", "Lists", "Reviews", "Social data"].map((item: string) => (
                <div key={item} className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-rose-400"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="deleteAccountInput" className="text-sm text-zinc-400">
              To continue type <b className="font-semibold text-rose-400">DELETE ACCOUNT</b> in the field below
            </label>
            <input type="text" id="deleteAccountInput" name="deleteAccountInput" maxLength={20} autoComplete="off" placeholder="DELETE ACCOUNT"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 outline-hidden font-medium tracking-wide placeholder:text-zinc-600 transition focus:border-rose-500 focus:bg-white/10" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {errorBlock}
            <div className="sm:ml-auto flex gap-3">
              <Dialog.Close className="flex-1 sm:flex-none flex items-center justify-center h-11 px-6 rounded-xl font-medium bg-white/5 border border-white/15 transition hover:bg-white/10">
                Cancel
              </Dialog.Close>
              <button onClick={() => handleDeleteAccount()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/40 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (chooseMode === "disconnectSteam") {
    return (
      <div className="relative w-full max-w-2xl mx-auto border border-white/15 rounded-2xl bg-zinc-950 text-white shadow-2xl">

        {/* Subtle Steam blue glow backdrop */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-600/15 blur-3xl" />
        </div>

        {closeButton}

        <div className="relative flex flex-col gap-6 px-4 py-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 pr-10">
            <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-sky-500/15 text-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" /><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" /><path d="m8 2v3" /><path d="M2 8h3" /><path d="M16 22v-3" /><path d="M19 16h3" /></svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Disconnect Steam</h2>
              <p className="text-sm text-zinc-400">Are you sure you want to disconnect your Steam account?</p>
            </div>
          </div>

          {/* Reassurance */}
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-green-400"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
            <p>The games imported and stats will remain in your Statrix library.</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {errorBlock}
            <div className="sm:ml-auto flex gap-3">
              <Dialog.Close className="flex-1 sm:flex-none flex items-center justify-center h-11 px-6 rounded-xl font-medium bg-white/5 border border-white/15 transition hover:bg-white/10">
                Cancel
              </Dialog.Close>
              <Dialog.Close onClick={() => handleDisconnectSteam()} className="flex-1 sm:flex-none flex items-center justify-center h-11 px-6 rounded-xl font-semibold bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-900/40 transition">
                Disconnect
              </Dialog.Close>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
