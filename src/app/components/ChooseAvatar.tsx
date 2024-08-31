import React, { useEffect, useState } from "react";
import getAvatarImages from "../actions/getAvatarImages";

interface ChooseAvatarProps {
    currentAvatarId: number,
    handleClose: () => void;
}

interface Avatar {
    avatar_id: number;
    avatar_name: string;
}

export default function ChooseAvatar({currentAvatarId, handleClose}:ChooseAvatarProps){

    const [avatarImages, setAvatarImages] = useState([])
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({avatar_id: currentAvatarId, avatar_name: ""})

    let images:any = []

    useEffect(() => {
        async function getImages(){
            images = await getAvatarImages()
            setAvatarImages(images)

            // Here we get the image name of the current avatar using the currentAvatarId
            setSelectedAvatar({avatar_id: currentAvatarId, avatar_name: images[currentAvatarId-1].avatar_image_name})
        }
        getImages()
    }, [])


    function handleSelectAvatar(avatar_image_id:number, avatar_image_name:string){

        // First we remove the previous avatar div outlined
        let avatarDivPrevious:HTMLDivElement = document.getElementById(`avatar${selectedAvatar.avatar_id}`) as HTMLDivElement
        avatarDivPrevious.style.outline = "none"

        // Then we select the new avatar div and we outline it
        setSelectedAvatar({avatar_id: avatar_image_id, avatar_name: avatar_image_name})

        let avatarDiv:HTMLDivElement = document.getElementById(`avatar${avatar_image_id}`) as HTMLDivElement
        if(avatarDiv != null){
            avatarDiv.style.outline ="5px solid #00ff3c"
        }
    }

    // Scroll to top when entering this component
    window.scrollTo(0,0)

    return (
        <div className="absolute z-10 w-full h-full bg-black outline outline-1 outline-black flex flex-col overflow-scroll no-scrollbar">
            <div className="flex items-center bg-gray-800 text-xs md:text-xl p-2 sm:p-4">
                <p className="mr-4 md:mr-24">Choose your avatar</p>
                <p className="text-green-600 mr-2">Current:</p>
                <p>{selectedAvatar.avatar_name}</p>
                <button className="border p-1 md:w-32 absolute right-4" onClick={handleClose}>Close</button>
            </div>
            <div className="flex flex-col p-2 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-12 mt-8">
                    {avatarImages.map((item:any, ident:number)=> (
                        <div key={ident} className="flex flex-col items-center text-sm">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 xl:w-48 xl:h-48 rounded-full overflow-hidden hover:outline hover:outline-green-600" id={"avatar"+item.avatar_image_id} onClick={()=> handleSelectAvatar(item.avatar_image_id, item.avatar_image_name)}>
                                <img src={`/profileImages/${item.avatar_image}`} className="h-full w-full object-cover"/>
                            </div>
                            <p className="mt-2">{item.avatar_image_name}</p>
                        </div>
                    ))}
                </div>
            </div>                    
        </div>
    )
}