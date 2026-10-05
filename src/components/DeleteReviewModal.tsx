"use client"
import React, { useState } from "react";
import { Dialog } from "radix-ui";
import { useSession } from "next-auth/react";
import { deleteReview } from "@/actions/deleteReview";
import ReviewCard from "./ReviewCard";


export default function DeleteReviewModal({ review, reviews, setReviews }: any) {

    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [error, setError] = useState<string | null>(null)

    async function handleDeleteReview() {
        try {
            await deleteReview(review.review_id, review.game_id, userId)
            setReviews(reviews.filter((r: any) => r.review_id !== review.review_id))

            // We simulate that the user presses ESC to close the modal
            const escEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                keyCode: 27,
                which: 27,
                bubbles: true
            });

            document.dispatchEvent(escEvent);
        } catch (error:any) {
            console.log(error)
            setError(error.message)
        }
    }

    return (
        <div className="relative w-full md:w-200 flex flex-col border border-gray-500 space-y-8 mx-2 px-4 py-10 md:px-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="mt-8 absolute top-0 right-10 p-2 rounded-sm cursor-pointer transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <div className="flex items-center space-x-2">
                <svg width="54px" height="54px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="17" r="1" fill="#ffffff"></circle> <path d="M12 10L12 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <h2 className="text-3xl mt-3">Warning</h2>
            </div>

            <p>Are you sure you want to delete this review?</p>

            <ReviewCard review={review} index={0} gameName={review.game_name} userId={userId} handleReviewActions={() => {}} openReviewId={null} handleLikeReview={() => { }} setModalType={() => { }} setReviewClicked={() => { }} />

            <div className="flex items-center space-x-8">
                <button onClick={handleDeleteReview} className="text-md sm:text-lg border-green-500 text-green-400 cursor-pointer hover:bg-green-900/30 rounded-xl px-5 py-2 md:px-6 md:py-3">Delete</button>
                <Dialog.Close className="text-md sm:text-lg text-white px-5 py-2 md:px-6 md:py-3 rounded-xl cursor-pointer bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                    Cancel
                </Dialog.Close>
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </div>
    )
}