import React, { useEffect, useRef, useState } from "react";
import getBannerImages from "../actions/getBannerImages";
import { pool } from "@/util/postgres";
import updateUserBanner from "../actions/updateUserBanner";

interface ChooseBannerProps {
    current_banner_id: number,
    handleClose: () => void;
}

interface Banner {
    banner_id: number;
    banner_name: string;
}

export default function ChooseBanner({current_banner_id, handleClose}:ChooseBannerProps){

    const [bannerImages, setBannerImages] = useState([])
    const [selectedBanner, setSelectedBanner] = useState<Banner>({banner_id: current_banner_id, banner_name: ""})

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
            setSelectedBanner({banner_id: current_banner_id, banner_name: images[current_banner_id-1].banner_image_name})
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

        try{
            return updateUserBanner(selectedBanner.banner_id, selectedBanner.banner_name)
        } catch (error){
            console.log(error)
            return;
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