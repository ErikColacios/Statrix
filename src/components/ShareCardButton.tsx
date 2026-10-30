"use client"
import React, { useEffect, useRef, useState } from "react";
import getUserShareCard from "@/actions/getUserShareCard";

type Props = {
    userName: string;
    className?: string;
};

export default function ShareCardButton({ userName, className }: Props) {
    const dialogRef = useRef<React.ElementRef<"dialog">>(null)
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState(false)

    // The image is generated when the modal is opened. The file must be ready before clicking "Share",
    // because some browsers (Safari) block navigator.share if there is an await between the click and the call
    useEffect(() => {
        if (!open) return
        dialogRef.current?.showModal()

        let objectUrl: string | null = null
        getUserShareCard()
            .then((res) => {
                if (!res.success || !res.image) throw new Error(res.message)
                // Converts the base64 data URI into a Blob
                return fetch(res.image).then((r) => r.blob())
            })
            .then((blob) => {
                objectUrl = URL.createObjectURL(blob)
                setPreviewUrl(objectUrl)
                setFile(new File([blob], `statrix-${userName}.jpg`, { type: "image/jpeg" }))
            })
            .catch(() => setError(true))

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [open, userName])

    function closeModal() {
        dialogRef.current?.close()
        setOpen(false)
        setFile(null)
        setPreviewUrl(null)
        setError(false)
    }

    const canShareFile = file && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })

    async function handleShare() {
        if (!file) return
        try {
            await navigator.share({
                files: [file],
                title: "My Statrix card",
                text: `My gaming stats on Statrix: https://statrix.app/profile/${userName}`,
            })
        } catch {
            // The user closed the share menu
        }
    }

    function handleDownload () {
        if (!previewUrl) return
        const link = document.createElement("a")
        link.href = previewUrl
        link.download = `statrix-${userName}.jpg`
        link.click()
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className={`flex items-center justify-center space-x-2 px-3 py-1 rounded-lg border border-green-500 text-green-400 hover:bg-green-900/30 transition duration-300 ${className ?? ""}`}>
                <img src="/staticImages/icon_share.png" alt="Share icon" className="w-4" />
                <span>Share card</span>
            </button>

            {open && (
                <dialog ref={dialogRef} onClose={closeModal} className="m-auto rounded-2xl bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-xs">
                    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-zinc-900 text-white p-6 w-[90vw] max-w-sm">
                        <div className="flex items-center w-full mb-4">
                            <p className="text-2xl font-black">Your Statrix card</p>
                            <button onClick={closeModal} className="ml-auto text-gray-400 hover:text-white text-2xl leading-none" aria-label="Close">×</button>
                        </div>

                        <div className="w-full aspect-[9/16] max-h-[60vh] flex items-center justify-center rounded-lg overflow-hidden bg-black/40">
                            {previewUrl && <img src={previewUrl} alt="Statrix card preview" className="h-full w-full object-contain" />}
                            {!previewUrl && !error && <div className="loader" />}
                            {error && <p className="text-gray-400 px-4 text-center">Something went wrong generating your card. Try again later.</p>}
                        </div>

                        <p className="text-sm text-gray-400 mt-4 text-center">Share it on your Instagram or TikTok stories!</p>

                        <div className="flex w-full space-x-3 mt-4">
                            {canShareFile && (
                                <button onClick={handleShare} className="flex-1 px-4 py-2 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">Share</button>
                            )}
                            <button onClick={handleDownload} disabled={!previewUrl}
                                className={`flex-1 px-4 py-2 rounded-xl transition duration-300 disabled:opacity-50 ${canShareFile ? "border border-green-500 text-green-400 hover:bg-green-900/30" : "bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600"}`}>
                                Download
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    )
}
