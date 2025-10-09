import React, { useEffect, useRef, useState } from "react";
import getAvatarImages from "../actions/getAvatarImages";
import updateUserAvatar from "../actions/updateUserAvatar";

interface ChooseAvatarBannerProps {
  chooseMode?: "avatar" | "banner";
  current_avatar_id: number;
  current_banner_id: number;
  handleClose: () => void;
}

interface Avatar {
  avatar_id: number;
  avatar_name: string;
}

interface Banner {
  banner_id: number;
  banner_name: string;
}

export default function ChooseAvatarBanner({chooseMode, current_avatar_id, current_banner_id, handleClose}: ChooseAvatarBannerProps) {

  if (chooseMode == "avatar") {
    return (
      <div className="flex w-full h-[75vh] md:h-[65vh] flex-col border border-gray-500 space-y-8 pl-4 pr-4 md:pl-10 md:pr-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
        <div className="flex items-center text-xs md:text-xl p-2 sm:p-4">
          <p className="mr-4 md:mr-24">Choose your avatar</p>
          <p className="text-green-600 mr-2">Current:</p>
          {/* <p>{selectedAvatar.avatar_name}</p> */}
          <p>Leon</p>
          <button className="border p-1 md:w-36 absolute right-4">Save</button>
        </div>
        <div className="flex flex-col p-2 sm:p-6">
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-12 mt-8">
                    {avatarImages.map((item:any, ident:number)=> (
                        <div key={ident} className="flex flex-col items-center text-sm">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 xl:w-48 xl:h-48 rounded-full overflow-hidden hover:outline hover:outline-green-600" id={"avatar"+item.avatar_image_id} onClick={()=> handleSelectAvatar(item.avatar_image_id, item.avatar_image_name)}>
                                <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover"/>
                            </div>
                            <p className="mt-2">{item.avatar_image_name}</p>
                        </div>
                    ))}
                </div> */}
        </div>
      </div>
    );
  } else if (chooseMode == "banner") {

    return (
        <div className="flex w-full h-[75vh] md:h-[65vh] flex-col border border-gray-500 space-y-8 pl-4 pr-4 md:pl-10 md:pr-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <div className="flex items-center text-xs md:text-xl p-2 sm:p-4">
                <p className="mr-4 md:mr-24">Choose your banner</p>
                <p className="text-green-600 mr-2">Current:</p>
                {/* <p>{selectedBanner.banner_name}</p> */}
                <p>Aperture</p>
                <button className="border p-1 md:w-36 absolute right-4">Save</button>
            </div>
            <div className="flex flex-col p-2 sm:p-2">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6  mt-8">
                    {bannerImages.map((item:any, ident:number)=> (
                        <div key={ident} className="flex flex-col items-center text-sm">
                            <div className="w-full h-26 sm:w-92 sm:h-32   hover:outline hover:outline-green-600" id={"banner"+item.banner_image_id} onClick={()=> handleSelectAvatar(item.banner_image_id, item.banner_image_name)}>
                                <img src={`/bannerImages/${item.banner_image}`} className="h-full w-full object-cover"/>
                            </div>
                            <p className="mt-2">{item.banner_image_name}</p>
                        </div>
                    ))}
                </div> */}
            </div>                    
        </div>
    );
  }
}
