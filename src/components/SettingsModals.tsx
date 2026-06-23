"use client"
import React, { useEffect, useState } from "react";
import getAvatarImages from "../actions/getAvatarImages";
import updateUserAvatar from "../actions/updateUserAvatar";
import getBannerImages from "../actions/getBannerImages";
import updateUserBanner from "../actions/updateUserBanner";
import { Dialog } from "radix-ui";
import { deleteUser } from "@/actions/deleteUser";
import { logOutUser } from "@/actions/logOutUser";

interface SettingsModalsProps {
  chooseMode?: "avatar" | "banner" | "deleteUser";
  currentAvatarId: number;
  currentBannerId: number;
}

export default function SettingsModals({ chooseMode, currentAvatarId, currentBannerId }: SettingsModalsProps) {

  // Avatars
  const [avatarImages, setAvatarImages] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({ avatar_id: currentAvatarId, avatar_name: "" })

  // Banners
  const [bannerImages, setBannerImages] = useState([])
  const [selectedBanner, setSelectedBanner] = useState<Banner>({ banner_id: currentBannerId, banner_name: "" })

  const [errorMessage, setErrorMessage] = useState("")

  // Fetch avatar images or banner images (depending on the choose mode)
  useEffect(() => {

    async function getAvatarImgs() {
      let avatarImgs: any = []
      avatarImgs = await getAvatarImages()
      setAvatarImages(avatarImgs)
      setSelectedAvatar({ avatar_id: currentAvatarId, avatar_name: avatarImgs[currentAvatarId - 1].avatar_image_name })
    }

    async function getBannerImgs() {
      let bannerImgs: any = []
      bannerImgs = await getBannerImages()
      setBannerImages(bannerImgs)
      setSelectedBanner({ banner_id: currentBannerId, banner_name: bannerImgs[currentBannerId - 1].banner_image_name })
    }

    if (chooseMode === "avatar") {
      getAvatarImgs()

    } else if (chooseMode === "banner") {
      getBannerImgs()
    }
  }, [])


  function handleSelectAvatar(avatar_image_id: number, avatar_image_name: string) {

    // First we remove the previous avatar div outlined
    let avatarDivPrevious: HTMLDivElement = document.getElementById(`avatar${selectedAvatar.avatar_id}`) as HTMLDivElement
    avatarDivPrevious.style.outline = "none"

    // Then we select the new avatar div and we outline it
    setSelectedAvatar({ avatar_id: avatar_image_id, avatar_name: avatar_image_name })

    let avatarDiv: HTMLDivElement = document.getElementById(`avatar${avatar_image_id}`) as HTMLDivElement
    if (avatarDiv != null) {
      avatarDiv.style.outline = "5px solid #00ff3c"
    }
  }

  function handleSelectBanner(banner_image_id: number, banner_image_name: string) {

    // First we remove the previous banner div outlined
    let bannerDivPrevious: HTMLDivElement = document.getElementById(`banner${selectedBanner.banner_id}`) as HTMLDivElement
    bannerDivPrevious.style.outline = "none"

    // Then we select the new banner div and we outline it
    setSelectedBanner({ banner_id: banner_image_id, banner_name: banner_image_name })

    let bannerDiv: HTMLDivElement = document.getElementById(`banner${banner_image_id}`) as HTMLDivElement
    if (bannerDiv != null) {
      bannerDiv.style.outline = "5px solid #00ff3c"
    }
  }

  async function updateAvatar() {
    window.location.reload()
    try {
      return updateUserAvatar(selectedAvatar.avatar_id, selectedAvatar.avatar_name)
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function updateBanner() {
    window.location.reload()
    try {
      return updateUserBanner(selectedBanner.banner_id, selectedBanner.banner_name)
    } catch (error) {
      console.log(error)
      return;
    }
  }

  async function handleDeleteAccount() {
    try {
      let deleteAccountInput: HTMLInputElement = document.getElementById('deleteAccountInput') as HTMLInputElement

      const response = await deleteUser(deleteAccountInput.value as string)
      if(response?.error) {
          setErrorMessage(response?.error)
          return;
      }
      await logOutUser()
    } catch (error) {
      console.log(error)
      return;
    }
  }


  if (chooseMode === "avatar") {
    return (
      <div className="flex w-full h-[75vh] md:h-[65vh] flex-col overflow-scroll no-scrollbar border border-gray-500 px-4 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
        <div className="flex items-center text-white text-xs md:text-xl py-6 sm:py-8">
          <p className="mr-4 md:mr-24">Choose your avatar</p>
          <p className="text-green-600 mr-2">Current:</p>
          <p>{selectedAvatar.avatar_name}</p>
          <button className="absolute right-4 text-sm md:text-lg px-3 py-2 md:px-6 md:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
            onClick={() => updateAvatar()}>
            Save
          </button>
        </div>

        {/* Avatar images */}
        <div className="flex flex-col ">
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-12 mt-8">
            {avatarImages.map((item: any, ident: number) => (
              <div key={ident} className="flex flex-col items-center text-sm">
                <div className="w-24 h-24 sm:w-32 sm:h-32 xl:w-48 xl:h-48 rounded-full overflow-hidden hover:outline-solid hover:outline-green-600" id={"avatar" + item.avatar_image_id} onClick={() => handleSelectAvatar(item.avatar_image_id, item.avatar_image_name)}>
                  <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" alt="Avatar image"/>
                </div>
                <p className="mt-2">{item.avatar_image_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  } else if (chooseMode === "banner") {
    return (
      <div className="flex w-full h-[75vh] flex-col overflow-scroll no-scrollbar border border-gray-500 px-4 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
        <div className="flex items-center text-white text-xs md:text-xl py-6 sm:py-8">
          <p className="mr-4 md:mr-24">Choose your banner</p>
          <p className="text-green-600 mr-2">Current:</p>
          <p>{selectedBanner.banner_name}</p>
          <button className="absolute right-4 text-sm md:text-lg px-3 py-2 md:px-6 md:py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
            onClick={() => updateBanner()}>
            Save
          </button>
        </div>

        {/* Banner images */}
        <div className="flex flex-col p-2 sm:p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6  mt-8">
            {bannerImages.map((item: any, ident: number) => (
              <div key={ident} className="flex flex-col items-center text-sm">
                <div className="w-full h-26 sm:w-92 sm:h-32   hover:outline-solid hover:outline-green-600" id={"banner" + item.banner_image_id} onClick={() => handleSelectBanner(item.banner_image_id, item.banner_image_name)}>
                  <img src={`/bannerImages/${item.banner_image}`} className="h-full w-full object-cover" alt="Banner image"/>
                </div>
                <p className="mt-2">{item.banner_image_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (chooseMode === "deleteUser") {
    return (
      <div className="flex flex-col items-center justify-center text-center md:h-[55vh] border border-gray-600 space-y-4 px-4 md:px-10 blur-none text-white rounded-2xl bg-black/20 backdrop-blur-lg">
        <Dialog.Close className="mt-8 absolute top-0 right-10 p-2 rounded-sm transition hover:bg-gray-800" >
            <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
        </Dialog.Close>
            <svg width="54px" height="54px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="17" r="1" fill="#ffffff"></circle> <path d="M12 10L12 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            <h2 className="hidden sm:flex text-3xl">Warning</h2>
            <div className="sm:w-1/2 md:w-2/3 space-y-4">
              <p>Are you sure you want to delete this account?<br/>
              All your game data, your lists, your reviews and your social data will be erased and cannot be recovered.</p>
              <p>To continue type <b>DELETE ACCOUNT</b> in the field below</p>
            </div>

            <input type="text" id="deleteAccountInput" name="deleteAccountInput" maxLength={20} className="md:w-1/4 p-1 text-center bg-gray-800 outline-hidden border border border-gray-700 focus:border-green-600" />

            <div className="flex space-x-8 mt-12">
                <button onClick={() => handleDeleteAccount()} className="text-md sm:text-lg border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-6 py-3">Delete</button>
                <Dialog.Close className="text-md sm:text-lg text-white px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                    Cancel
                </Dialog.Close>
            </div>
            <div className="h-10 md:h-0">
              <p className="text-red-500">{errorMessage}</p>
            </div>
        </div>
    )
  }
}