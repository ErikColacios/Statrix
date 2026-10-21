'use client'
import React, { useState } from 'react'
import { Dialog } from 'radix-ui'
import { insertReview } from '../actions/insertReview'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type Props = {
    gameId: number
    gameName: string
    gameCover: string
}

export default function ReviewModal({ gameId, gameName, gameCover }: Props) {

    const session: any = useSession()
    const userId: string = session?.data?.user?.id as string
    const [characterCount, setCharacterCount] = useState<number>(0)
    const [error, setError] = useState<string>("")

    const handleInsertReview = async () => {
        const reviewBody: string = (document.getElementById('reviewBody') as HTMLTextAreaElement).value
        if (reviewBody === '') {
            setError('Please enter a review')
        } else {
            setError('')
            await insertReview(gameId, gameName, reviewBody, gameCover)

            // We simulate that the user presses ESC to close the modal
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                which: 27,
                bubbles: true,
            })
            document.dispatchEvent(escEvent)
        }
    }

    const coverSrc: string = `https://images.igdb.com/igdb/image/upload/t_720p/${gameCover}.png`
    const maxCharacters: number = 1500

    const closeButton = (
        <Dialog.Close aria-label="Close" className="absolute z-10 right-4 top-4 p-2 rounded-full text-zinc-400 transition hover:text-white hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </Dialog.Close>
    )

    const backdrop = (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none" aria-hidden="true">
            <img src={coverSrc} alt="" className="w-full h-full object-cover scale-125 blur-3xl opacity-25" />
            <div className="absolute inset-0 bg-linear-to-br from-green-700/20 via-zinc-950/80 to-zinc-950/95" />
        </div>
    )

    if (!userId) {
        return (
            <div className="relative w-[calc(100%-1rem)] md:w-full border border-white/15 rounded-2xl bg-zinc-950 text-white shadow-2xl">
                {backdrop}
                {closeButton}
                <div className="relative flex flex-col items-center text-center gap-4 px-6 py-14 md:px-10">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">Create an account</h2>
                    <p className="text-zinc-400 max-w-sm">Enter or create an account to post game reviews and much more.</p>
                    <Link href="/login" className="mt-2 w-full sm:w-72 text-lg font-semibold px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                        Start now!
                    </Link>
                </div>
            </div>
        )
    } else {
        return (
            <div className="relative w-[calc(100%-1rem)] md:w-full border border-white/15 rounded-2xl bg-zinc-950 text-white shadow-2xl">
                {backdrop}
                {closeButton}
                <div className="relative flex flex-col gap-6 px-4 py-8 md:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 pr-10">
                        <img src={coverSrc} alt="Game cover" className="w-14 md:w-16 aspect-3/4 object-cover rounded-lg shadow-xl ring-1 ring-white/10" />
                        <div className="min-w-0">
                            <p className="text-xs  tracking-wider text-zinc-400">Write a review</p>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight truncate">{gameName}</h2>
                        </div>
                    </div>

                    {/* Review body */}
                    <div className="relative">
                        <textarea
                            id="reviewBody"
                            maxLength={maxCharacters}
                            className={`w-full h-48 md:h-64 rounded-xl p-4 pb-8 text-sm leading-relaxed bg-white/5 border outline-hidden resize-none placeholder:text-zinc-500 transition focus:bg-white/10
                                ${error ? "border-rose-500/70 focus:border-rose-500" : "border-white/10 focus:border-green-500"}`}
                            placeholder="What did you think about this game?"
                            onChange={e => setCharacterCount(e.target.value.length)}
                        ></textarea>
                        <p className={`absolute bottom-3 right-4 text-xs  pointer-events-none
                            ${characterCount >= maxCharacters ? "text-rose-400" : characterCount >= maxCharacters * 0.9 ? "text-yellow-400" : "text-zinc-500"}`}>
                            {characterCount}/{maxCharacters}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3">
                        {error &&
                            <p className="flex items-center gap-2 text-sm text-rose-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                {error}
                            </p>
                        }
                        <button onClick={() => handleInsertReview()}
                            className="sm:ml-auto flex items-center justify-center h-11 px-6 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                            Post review
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
