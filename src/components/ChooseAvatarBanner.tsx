"use client"
import React, { useEffect, useState } from "react";
import getAvatarImages from "../actions/getAvatarImages";
import updateUserAvatar from "../actions/updateUserAvatar";
import getBannerImages from "../actions/getBannerImages";
import updateUserBanner from "../actions/updateUserBanner";

interface ChooseAvatarBannerProps {
  chooseMode?: "avatar" | "banner";
  current_avatar_id: number;
  current_banner_id: number;
}

export default function ChooseAvatarBanner({ chooseMode, current_avatar_id, current_banner_id }: ChooseAvatarBannerProps) {

  // Avatars
  const [avatarImages, setAvatarImages] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({ avatar_id: current_avatar_id, avatar_name: "" })

  // Banners
  const [bannerImages, setBannerImages] = useState([])
  const [selectedBanner, setSelectedBanner] = useState<Banner>({ banner_id: current_banner_id, banner_name: "" })


  // Fetch avatar images or banner images (depending on the choose mode)
  useEffect(() => {

    async function getAvatarImgs() {
      let avatarImgs: any = []
      avatarImgs = await getAvatarImages()
      setAvatarImages(avatarImgs)
      setSelectedAvatar({ avatar_id: current_avatar_id, avatar_name: avatarImgs[current_avatar_id - 1].avatar_image_name })
    }

    async function getBannerImgs() {
      let bannerImgs: any = []
      bannerImgs = await getBannerImages()
      setBannerImages(bannerImgs)
      setSelectedBanner({ banner_id: current_banner_id, banner_name: bannerImgs[current_banner_id - 1].banner_image_name })
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


  if (chooseMode == "avatar") {
    return (
      <div className="flex w-full h-[75vh] md:h-[65vh] flex-col overflow-scroll no-scrollbar border border-gray-500 px-4 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
        <div className="flex items-center text-white text-xs md:text-xl py-6 sm:py-8">
          <p className="mr-4 md:mr-24">Choose your avatar</p>
          <p className="text-green-600 mr-2">Current:</p>
          <p>{selectedAvatar.avatar_name}</p>
          <button className="absolute right-4 text-sm md:text-lg px-3 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
            onClick={() => updateAvatar()}>
            Save
          </button>
        </div>

        {/* Avatar images */}
        <div className="flex flex-col ">
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-12 mt-8">
            {avatarImages.map((item: any, ident: number) => (
              <div key={ident} className="flex flex-col items-center text-sm">
                <div className="w-24 h-24 sm:w-32 sm:h-32 xl:w-48 xl:h-48 rounded-full overflow-hidden hover:outline hover:outline-green-600" id={"avatar" + item.avatar_image_id} onClick={() => handleSelectAvatar(item.avatar_image_id, item.avatar_image_name)}>
                  <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" alt="Avatar image"/>
                </div>
                <p className="mt-2">{item.avatar_image_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  } else if (chooseMode == "banner") {
    return (
      <div className="flex w-full h-[75vh] flex-col overflow-scroll no-scrollbar border border-gray-500 px-4 md:px-10 text-white rounded-2xl bg-black/60 backdrop-blur-lg">
        <div className="flex items-center text-white text-xs md:text-xl py-6 sm:py-8">
          <p className="mr-4 md:mr-24">Choose your banner</p>
          <p className="text-green-600 mr-2">Current:</p>
          <p>{selectedBanner.banner_name}</p>
          <button className="absolute right-4 text-sm md:text-lg px-3 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
            onClick={() => updateBanner()}>
            Save
          </button>
        </div>

        {/* Banner images */}
        <div className="flex flex-col p-2 sm:p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6  mt-8">
            {bannerImages.map((item: any, ident: number) => (
              <div key={ident} className="flex flex-col items-center text-sm">
                <div className="w-full h-26 sm:w-92 sm:h-32   hover:outline hover:outline-green-600" id={"banner" + item.banner_image_id} onClick={() => handleSelectBanner(item.banner_image_id, item.banner_image_name)}>
                  <img src={`/bannerImages/${item.banner_image}`} className="h-full w-full object-cover" />
                </div>
                <p className="mt-2">{item.banner_image_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}