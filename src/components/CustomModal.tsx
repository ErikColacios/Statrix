"use client"
import React, { useEffect, useRef, useState } from "react";
import { deleteList } from "../actions/deleteList";
import { deleteUserFriendship } from "@/actions/deleteUserFriendship";

type Props = {
    title: string,
    text: string;
    type: string,
    action: { actionName: string; parameters: Record<string, any> }; // Ex: actionName = deleteLists. parameters = list_id, user_id ...
    closeModal: () => void;
};

export default function CustomModal({ title, text, type, action, closeModal }: Props) {
    const dialogRef = useRef<React.ElementRef<"dialog">>(null)
    const [visible, setVisible] = useState(true);
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
        else if (action.actionName === "deleteUserFriendship") {
            deleteUserFriendship(action.parameters.item.user_id)
            window.location.reload();
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadingOut(true);
            setTimeout(() => setVisible(false), 1000);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);


    switch (type) {
        case "alert":
            return (
                <div className={`transition-opacity duration-1000 ${fadingOut ? "opacity-0" : "opacity-100"} fixed top-20 right-20 z-50 p-2 w-80 backdrop-blur-sm rounded text-xl text-center border border-green-600 bg-gray-800/70 bg-black text-white `}>
                    <p>{text}</p>
                </div>
            )
        case "question":
            return (
                <dialog className="rounded rounded-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm" ref={dialogRef} onClick={()=> closeModal()}>
                    <div className="flex flex-col justify-center items-center text-center rounded rounded-2xl w-96 h-80 border border-gray-600 bg-zinc-900 text-white p-8">
                        <p className="text-3xl font-black mb-4">{title}</p>
                        <p>{text}</p>
                        <div className="flex space-x-8 mt-12">
                            <button onClick={handleAction} className="w-32 border border-green-400 p-3 text-center transition hover:bg-green-400 hover:text-black">Yes</button>
                            <button onClick={()=> closeModal()} className="w-32 border border-red-400  p-3 text-center transition hover:bg-red-400 hover:text-black">Cancel</button>
                        </div>
                    </div>
                </dialog>
            )
        default:
            break;
    }
}