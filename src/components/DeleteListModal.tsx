"use client"
import React from "react"
import { deleteList } from "@/actions/deleteList";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui"

type Props = {
    listId: string
};

export default function DeleteListModal({listId}:Props) {

    const router = useRouter()

    async function handleDeleteList() {
        await deleteList(listId)
        router.push('/mylists')
    }

    return (
        <div className="relative w-full h-full sm:h-auto flex flex-col justify-center sm:border border-rose-500/30 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl">

            {/* Subtle red glow backdrop */}
            <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-600/15 blur-3xl" />
            </div>

            <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Dialog.Close>

            <div className="relative flex flex-col gap-6 px-4 py-8 md:p-10">
                {/* Header */}
                <div className="flex items-center gap-4 pr-10">
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-rose-500/15 text-rose-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">Delete list</h2>
                        <p className="text-sm text-zinc-400">Are you sure you want to delete this list? This action can&apos;t be undone.</p>
                    </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-3 p-3 sm:px-4 rounded-2xl border border-white/10 bg-white/3 text-sm text-zinc-400">
                    <img src="/staticImages/icon_list.png" alt="" className="w-5 h-5 shrink-0 opacity-70" />
                    <p>The games will stay in your library with their hours played, rating and status.</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 sm:ml-auto">
                    <Dialog.Close className="flex-1 sm:flex-none flex items-center justify-center h-11 px-6 rounded-xl font-medium bg-white/5 border border-white/15 cursor-pointer transition hover:bg-white/10">
                        Cancel
                    </Dialog.Close>
                    <button onClick={handleDeleteList} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/40 cursor-pointer transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
