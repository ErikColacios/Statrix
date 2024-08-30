import React from "react";

interface ChooseAvatarProps {
    isOpen: boolean;
    handleClose: () => void;
}

export default function ChooseAvatar({isOpen, handleClose}:ChooseAvatarProps){

    return (
        <div className="absolute z-10 w-full h-full bg-black flex flex-col p-4">
            <div className="flex">
                <p className="text-xl">Choose your avatar</p>
                <button className="w-32 border p-1 absolute right-4" onClick={handleClose}>Close</button>
            </div>                    

        </div>
    )
}