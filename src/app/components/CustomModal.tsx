"use client"
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { deleteList } from "../actions/deleteList";

type Props = {
  text: string;
  action: { actionName: string; parameters: Record<string, any> }; // Ex: actionName = deleteLists. parameters = list_id, user_id ...
};

export default function CustomModal({ text, action }: Props){
    const router = useRouter()
    const dialogRef = useRef<React.ElementRef<"dialog">>(null)
    const closeModal = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => e.target === dialogRef.current && router.back()

    useEffect(() => {
        dialogRef.current?.showModal()
    }, [])

    const handleAction = () => {
        if(action.actionName === "deleteList"){
            console.log("action: " + action.actionName)
            deleteList(action.parameters.list_id)
        }
    }

    
    return(
        <dialog className="rounded rounded-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm" ref={dialogRef} onClick={closeModal} onClose={router.back}>
            <div className="rounded rounded-2xl flex flex-col justify-center items-center text-center w-96 h-96 border border-green-500 bg-black text-white p-8">
                <p className="text-3xl font-black mb-4">WARNING</p>
                <p>{text}</p>
                <div className="flex space-x-8 mt-12">
                    <button onClick={handleAction} className="w-32 border border-green-400 p-3 text-center transition hover:bg-green-400 hover:text-black">Yes</button>
                    <button onClick={router.back} className="w-32 border border-red-400  p-3 text-center transition hover:bg-red-400 hover:text-black">Cancel</button>
                </div>
            </div>
        </dialog>
    )
}