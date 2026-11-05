"use client"
import React, { useEffect, useRef, useState } from "react";
import getUserShareCard from "@/actions/getUserShareCard";
import HoloCard from "./HoloCard";

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
                // Full screen and transparent: only the card and the floating buttons are seen over the blurred backdrop
                <dialog ref={dialogRef} onClose={closeModal}
                    className="m-0 h-dvh max-h-none w-screen max-w-none overflow-visible bg-transparent p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm">

                    {/* Clicking the empty space around the card closes it */}
                    <div className="flex h-full w-full items-center justify-center px-4 pb-24 pt-16" onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
                        {previewUrl && <HoloCard src={previewUrl} alt="Statrix card preview" className="h-[72vh] max-h-[52rem] max-w-[90vw] aspect-[9/16]" />}
                        {!previewUrl && !error && <div className="loader" />}
                        {error && <p className="max-w-xs text-center text-gray-300">Something went wrong generating your card. Try again later.</p>}
                    </div>

                    <button onClick={closeModal} aria-label="Close"
                        className="fixed right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-950/70 text-zinc-300 backdrop-blur-xl transition hover:bg-white/10 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>

                    {/* Floating buttons */}
                    {previewUrl &&
                        <div className="fixed inset-x-0 bottom-6 flex flex-col items-center gap-3 px-4 animate-element-appear">
                            <p className="text-xs text-zinc-400">Move your mouse or finger over the card!</p>
                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/80 p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                                {canShareFile && (
                                    <button onClick={handleShare}
                                        className="flex h-11 items-center rounded-xl bg-linear-to-r from-green-500 to-lime-500 px-6 font-semibold transition duration-300 hover:from-green-500 hover:to-lime-600">
                                        Share
                                    </button>
                                )}
                                <button onClick={handleDownload}
                                    className={`flex h-11 items-center gap-2 rounded-xl px-6 font-semibold transition duration-300 ${canShareFile ? "text-zinc-200 hover:bg-white/10" : "bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></svg>
                                    Download
                                </button>
                            </div>
                        </div>}
                </dialog>
            )}
        </>
    )
}
