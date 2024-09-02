import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import getBannerImages from "../actions/getBannerImages";

interface ChooseBannerProps {
    currentBannerId: number,
    handleClose: () => void;
    userId: string;
}

interface Banner {
    banner_id: number;
    banner_name: string;
}

export default function ChooseBanner({currentBannerId, handleClose, userId}:ChooseBannerProps){

    const [bannerImages, setBannerImages] = useState([])
    const [selectedBanner, setSelectedBanner] = useState<Banner>({banner_id: currentBannerId, banner_name: ""})

    let images:any = []

    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current = renderCount.current + 1;
      });
    
    // Scroll to top only when entering this component (first render of the component). In mobile version when you select a banner it scrolls to the top and looks ugly
    if(renderCount.current == 0){
        window.scrollTo(0,0)
    }

    useEffect(() => {
        async function getImages(){
            images = await getBannerImages()
            setBannerImages(images)

            // Here we get the image name of the current avatar using the currentAvatarId
            setSelectedBanner({banner_id: currentBannerId, banner_name: images[currentBannerId-1].banner_image_name})
        }
        getImages()
    }, [])


    function handleSelectAvatar(banner_image_id:number, banner_image_name:string){

        // First we remove the previous avatar div outlined
        let bannerDivPrevious:HTMLDivElement = document.getElementById(`banner${selectedBanner.banner_id}`) as HTMLDivElement
        bannerDivPrevious.style.outline = "none"

        // Then we select the new avatar div and we outline it
        setSelectedBanner({banner_id: banner_image_id, banner_name: banner_image_name})

        let bannerDiv:HTMLDivElement = document.getElementById(`banner${banner_image_id}`) as HTMLDivElement
        if(bannerDiv != null){
            bannerDiv.style.outline ="5px solid #00ff3c"
        }
    }

    async function updateAndClose (passedFunctionClose: () => void){

        passedFunctionClose()
        window.location.reload()
        const { error } = await supabase.from('user')
            .update({"user_banner_id": selectedBanner.banner_id, "user_banner": selectedBanner.banner_name})
            .match({"user_id": userId})
        if(error){
            console.log(error)
            return error;
        }else {
            var res = "User banner updated successfully!"
            console.log(res)
            return res
        }
    }


    return (
        <div className="absolute z-10 w-full h-full bg-black outline outline-1 outline-black flex flex-col overflow-scroll no-scrollbar">
            <div className="flex items-center bg-gray-800 text-xs md:text-xl p-2 sm:p-4">
                <p className="mr-4 md:mr-24">Choose your banner</p>
                <p className="text-green-600 mr-2">Current:</p>
                <p>{selectedBanner.banner_name}</p>
                <button className="border p-1 md:w-32 absolute right-4" onClick={()=> updateAndClose(handleClose)}>Close</button>
            </div>
            <div className="flex flex-col p-2 sm:p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6  mt-8">
                    {bannerImages.map((item:any, ident:number)=> (
                        <div key={ident} className="flex flex-col items-center text-sm">
                            <div className="w-full h-26 sm:w-92 sm:h-32   hover:outline hover:outline-green-600" id={"banner"+item.banner_image_id} onClick={()=> handleSelectAvatar(item.banner_image_id, item.banner_image_name)}>
                                <img src={`/bannerImages/${item.banner_image}`} className="h-full w-full object-cover"/>
                            </div>
                            <p className="mt-2">{item.banner_image_name}</p>
                        </div>
                    ))}
                </div>
            </div>                    
        </div>
    )
}