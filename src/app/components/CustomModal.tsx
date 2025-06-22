"use client"
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteList } from "../actions/deleteList";

type Props = {
    title: string,
    text: string;
    type: string,
    action: { actionName: string; parameters: Record<string, any> }; // Ex: actionName = deleteLists. parameters = list_id, user_id ...
};

export default function CustomModal({ title, text, type, action }: Props){
    const router = useRouter()
    const dialogRef = useRef<React.ElementRef<"dialog">>(null)
    const closeModal = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => e.target === dialogRef.current && router.back()

    const [visible, setVisible] = useState(false);
    const [fadingOut, setFadingOut] = useState(false);

    useEffect(() => {
        dialogRef.current?.showModal()
    }, [])

    const handleAction = () => {
        if (action.actionName === "deleteList") {
            deleteList(action.parameters.list_id)
        }
        else if (action.actionName === "displayAlert") {
            setVisible(true)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => setVisible(false), 1000);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    //if (!visible) return null;

    switch (type) {
        case "alert":
            return(
                <div className={`transition-opacity duration-1000 ${fadingOut ? "opacity-0" : "opacity-100"} fixed top-20 right-20 z-50 p-2 w-80 backdrop-blur-sm rounded text-xl text-center border border-green-600 bg-gray-800/70 bg-black text-white `}>
                    <p>{text}</p>
                </div>
            )
        case "question":
            return(
                <dialog className="rounded rounded-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm" ref={dialogRef} onClick={closeModal} onClose={router.back}>
                    <div className="rounded rounded-2xl flex flex-col justify-center items-center text-center w-96 h-80 border border-green-500 bg-black text-white p-8">
                        <p className="text-3xl font-black mb-4">{title}</p>
                        <p>{text}</p>
                        <div className="flex space-x-8 mt-12">
                            <button onClick={handleAction} className="w-32 border border-green-400 p-3 text-center transition hover:bg-green-400 hover:text-black">Yes</button>
                            <button onClick={router.back} className="w-32 border border-red-400  p-3 text-center transition hover:bg-red-400 hover:text-black">Cancel</button>
                        </div>
                    </div>
                </dialog>
            )
        default:
            break;
    }
}