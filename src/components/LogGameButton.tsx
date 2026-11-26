"use client"
import React, { useEffect, useRef, useState } from "react"
import { Dialog, Toast } from "radix-ui"
import { useRouter } from "next/navigation"
import SearchGameBar from "./SearchGameBar"
import AddGameModal from "./AddGameModal"
import { GameIGDB } from "@/types/GameIGDB"

// "Log game" button of the navbar. Opens a modal with 2 steps: search a game, then rate it with AddGameModal
export default function LogGameButton() {
    // Refreshes the current page after saving, so it shows the new data of the game
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [selectedGame, setSelectedGame] = useState<GameIGDB>()

    // Toast state, used by AddGameModal when the game is saved
    const timerRef = useRef(0)
    const [openToast, setOpenToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    useEffect(() => {
        return () => clearTimeout(timerRef.current)
    }, [])

    // When the modal is closed, the next time it opens again in the search step
    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen)
        if (!isOpen) setSelectedGame(undefined)
    }

    return (
        <Toast.Provider>
            <Dialog.Root open={open} onOpenChange={handleOpenChange}>
                <Dialog.Trigger aria-label="Log game"
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-linear-to-r from-green-500 to-lime-500 px-2.5 sm:px-3.5 font-semibold text-white shadow-[0_0_30px_-10px_rgba(34,197,94,0.7)] transition duration-300 hover:from-green-500 hover:to-lime-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                    <span className="hidden sm:inline">Log game</span>
                </Dialog.Trigger>

                <Dialog.Portal>
                    {/* Above the navbar, which is fixed with z-99 */}
                    <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
                    <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }}
                        className="fixed z-[101] w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-4/5 lg:w-3/5 2xl:w-3/7 rounded-lg shadow-xl
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]">
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>

                        {/* Step 1: search the game */}
                        {!selectedGame && (
                            <div className="relative w-full h-full sm:h-auto sm:min-h-120 flex flex-col sm:border border-white/15 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl">
                                {/* Subtle green glow backdrop */}
                                <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
                                </div>

                                <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </Dialog.Close>

                                <div className="relative flex flex-col flex-1 px-4 pt-24 pb-6 sm:p-8 md:px-10">
                                    <div className="sm:pr-10">
                                        <p className="text-2xl md:text-3xl font-bold leading-tight">Log game</p>
                                        <p className="text-sm text-zinc-400 mt-1">Search the game you played to rate it and save it to your library.</p>
                                    </div>
                                    <div className="mt-6">
                                        <SearchGameBar addNewGame={(game: GameIGDB) => setSelectedGame(game)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: rate the game. The key remounts it for each game, so it loads the saved data of that game */}
                        {selectedGame && (
                            <AddGameModal key={selectedGame.id} game={selectedGame} timerRef={timerRef} setOpenToast={setOpenToast} setToastMessage={setToastMessage}
                                onBack={() => setSelectedGame(undefined)}
                                onSave={() => router.refresh()} />
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Toast.Root className={`z-[101] fixed animate-slide-left flex flex-col bottom-15 right-5 sm:right-15 text-white
                rounded shadow-green-500/30 border-green-600 p-2 cardReviewGreen`} open={openToast} onOpenChange={setOpenToast}>
                <Toast.Description>
                    <div className="flex items-center space-x-2">
                        <img src="/staticImages/icon_tick_circle.png" alt="Success icon" className="w-5 h-5" />
                        <p>{toastMessage}</p>
                    </div>
                </Toast.Description>
                <Toast.Close />
            </Toast.Root>
            <Toast.Viewport />
        </Toast.Provider>
    )
}
