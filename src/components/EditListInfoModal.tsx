'use client'
import React, { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import { getListInfo } from '@/actions/getListInfo';
import updateListInfo from '@/actions/updateListInfo';
import { useRouter } from "next/navigation";
import { ListMode } from '@/enums/ListMode';
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import SortableItem from './SortableItem'
import ListInfoFields from './ListInfoFields'
import { Game } from '@/types/Game'

type Props = {
    listId: string,
    listContent: Game[],
    setListContent: any,
    timerRef:React.MutableRefObject<number>,
    setOpenToast: any,
    setToastMessage: any
};

export default function EditListInfoModal({ listId, listContent, setListContent, timerRef, setOpenToast, setToastMessage }: Props) {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [listName, setListName] = useState<string>("")
    const [listDescription, setListDescription] = useState<string>("")
    const [selectedVisibility, setSelectedVisibility] = useState<string>("");
    const [selectedMode, setSelectedMode] = useState<ListMode>(ListMode.UNRANKED)
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    useEffect(() => {
        const fetchListInfo = async () => {
            const res = await getListInfo(listId)
            setListName(res[0].list_name ?? "")
            setListDescription(res[0].list_description ?? "")
            setSelectedVisibility(res[0].list_visibility)
            setIsFeatured(res[0].list_featured)
            setSelectedMode(res[0].list_mode)
            setIsLoading(false)
        }

        fetchListInfo()
    }, [])

    async function saveChanges() {
        if (listName.trim() === '') {
            setError('The list name cannot be empty')
            return
        }

        try {
            setError(null)
            setIsSaving(true)
            await updateListInfo(listId, listName.trim(), listDescription, selectedVisibility, isFeatured, selectedMode, listContent)
            router.refresh()

            // Trigger Toast
            setToastMessage("List info updated successfully")
            setOpenToast(false)
            window.clearTimeout(timerRef.current)
            timerRef.current = window.setTimeout(() => { setOpenToast(true) }, 100)

            // We simulate that the user presses ESC to close the modal
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                which: 27,
                bubbles: true
            });

            document.dispatchEvent(escEvent);
        } catch (error: any) {
            setError(error.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="relative w-full h-full sm:h-[85vh] flex flex-col sm:border border-white/15 sm:rounded-2xl bg-zinc-950 text-white shadow-2xl">

            {/* Subtle green glow backdrop */}
            <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-600/15 blur-3xl" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-zinc-950/60" />
            </div>

            <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-15 sm:top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </Dialog.Close>

            {/* Header */}
            <div className="relative px-4 pt-24 sm:p-8 sm:pb-4 md:px-10 sm:pr-16">
                <p className="text-2xl md:text-3xl font-bold leading-tight">Edit list info</p>
                <p className="text-sm text-zinc-400 mt-1">Change the name, who can see the list and how the games are ordered.</p>
            </div>

            {isLoading ? (
                <div className="relative flex flex-1 items-center justify-center">
                    <div className="loader-small"></div>
                </div>
            ) : (
                <>
                    {/* Form, the only part that scrolls */}
                    <div className="relative flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-6 px-4 py-4 sm:px-8 md:px-10 text-sm">

                        <ListInfoFields
                            listName={listName} setListName={(name) => { setListName(name); setError(null) }}
                            listDescription={listDescription} setListDescription={setListDescription}
                            isFeatured={isFeatured} setIsFeatured={setIsFeatured}
                            visibility={selectedVisibility} setVisibility={setSelectedVisibility}
                            mode={selectedMode} setMode={setSelectedMode}
                            nameError={error} />

                        {/* Games */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Games</p>
                                <span className="min-w-6 h-6 px-2 flex items-center justify-center rounded-full text-xs font-semibold bg-white/5 text-zinc-400">{listContent.length}</span>
                                {selectedMode === ListMode.RANKED && <p className="ml-auto text-xs text-zinc-500">Drag and drop to order the games</p>}
                            </div>

                            <section className="grid gap-3 sm:gap-4 grid-cols-3 sm:grid-cols-5">
                                <DragDropProvider onDragEnd={event => {
                                        if(selectedMode === ListMode.UNRANKED) return
                                        if (event.canceled) return;
                                        const { source } = event.operation

                                        if (isSortable(source)) {
                                            const { initialIndex, index } = source

                                            if (initialIndex !== index) {
                                                setListContent((game:any) => {
                                                    const newItems = [...game]
                                                    const [removed] = newItems.splice(initialIndex, 1)
                                                    newItems.splice(index, 0, removed)
                                                    return newItems
                                                })
                                            }
                                        }
                                    }}>
                                    {/* List content */}
                                    {listContent.map((game: Game, index: number) => (
                                        <SortableItem key={game.game_id} id={game.game_id} index={index} imageId={game.game_image_id} listMode={selectedMode} disabled={selectedMode === ListMode.UNRANKED}/>
                                    ))}
                                </DragDropProvider>
                            </section>
                        </div>
                    </div>

                    {/* Footer, always visible */}
                    <div className="relative flex items-center justify-end gap-3 px-4 py-4 sm:px-8 md:px-10 border-t border-white/10">
                        <Dialog.Close className="h-10 px-4 rounded-xl text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">
                            Cancel
                        </Dialog.Close>
                        <button onClick={saveChanges} disabled={isSaving}
                            className="flex items-center h-10 px-5 rounded-xl text-sm font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300 disabled:opacity-60">
                            <img src="/staticImages/icon_confirmation.png" alt="Confirmation icon" className="w-3 mr-2" />
                            {isSaving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
