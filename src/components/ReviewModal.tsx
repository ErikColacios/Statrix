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

    if (!userId) {
        return (
            <div className="relative flex flex-col justify-center items-center text-center w-80 sm:w-full h-96 p-2 border border-gray-600 space-y-6 md:px-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
                <Dialog.Close className="mt-8 absolute top-0 right-10 p-2 rounded-sm transition hover:bg-gray-800">
                    <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">{' '}<title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">{' '}<g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff">{' '}<g id="icons" transform="translate(56.000000, 160.000000)">{' '}<polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446">{' '}</polygon>{' '}</g>{' '}</g>{' '}</g>{' '}</g></svg>
                </Dialog.Close>
                <h2 className="text-3xl">Create an account</h2>
                <p>Enter or create an account to post game reviews and much more.</p>
                <Link href="/login" className="sm:w-72 text-xl px-6 py-2 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                    Start now!
                </Link>
            </div>
        )
    } else {
        return (
            <div className="w-full h-full md:w-200 flex flex-col border border-gray-600 space-y-4 px-4 py-10 md:px-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
                <Dialog.Close className="mt-8 absolute top-0 right-10 p-2 rounded-sm transition hover:bg-gray-800">
                    <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">{' '}<title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">{' '}<g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff">{' '}<g id="icons" transform="translate(56.000000, 160.000000)">{' '}<polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446">{' '}</polygon>{' '}</g>{' '}</g>{' '}</g>{' '}</g>
                    </svg>
                </Dialog.Close>
                <h2 className="text-3xl font-bold">{gameName}</h2>
                <div className="flex flex-col md:flex-row items-center md:items-start mt-6">
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameCover}.png`}
                        alt="Game cover"
                        className="w-36 lg:w-48 rounded-sm"/>
                    <div className="flex flex-col w-full text-sm md:ml-8">
                        <textarea
                            id="reviewBody"
                            maxLength={1500}
                            className="w-full h-32 md:h-64 mt-4 sm:mt-0 bg-zinc-900 border border-gray-500 rounded-lg focus:outline-hidden resize-none focus:border-green-500 p-2"
                            placeholder="Your review"
                            onChange={e => setCharacterCount(e.target.value.length)}
                        ></textarea>
                        <p className="text-gray-400">{characterCount}/1500</p>
                    </div>
                </div>
                <div className="sm:ml-auto flex items-center space-x-4">
                    <p className="text-rose-500">{error}</p>
                    <button onClick={() => handleInsertReview()}
                        className="bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 py-2 px-4 rounded-md">
                        Post review
                    </button>
                </div>
            </div>
        )
    }
}