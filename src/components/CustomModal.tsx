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
                <dialog className="rounded rounded-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm" ref={dialogRef} >
                    <div className="flex flex-col justify-center items-center text-center rounded rounded-2xl md:w-96 h-80 border border-gray-600 bg-zinc-900 text-white p-8">
                        <p className="text-3xl font-black mb-4">{title}</p>
                        <p>{text}</p>
                        <div className="flex space-x-8 mt-12">
                            <button onClick={handleAction} className="text-md sm:text-lg text-white px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Delete</button>
                            <button onClick={()=> closeModal()} className="text-md sm:text-lg border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-6 py-3">Cancel</button>
                        </div>
                    </div>
                </dialog>
            )
        default:
            break;
    }
}