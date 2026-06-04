"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useSession } from "next-auth/react";
import { deleteReview } from "@/actions/deleteReview";


export default function DeleteReviewModal({ review, reviews, setReviews }: any) {

    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [error, setError] = useState<string | null>(null)

    async function handleDeleteReview() {
        try {
            await deleteReview(review.review_id, review.videogame_id, userId)
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
        <div className="relative w-full md:w-[50rem] h-96 md:h-96 flex flex-col border border-gray-500 space-y-8 mx-2 px-4 md:px-10 blur-none text-white rounded-2xl bg-black/60 backdrop-blur-lg">
            <Dialog.Close className="mt-8 absolute right-10 p-2 rounded transition hover:bg-gray-800" >
                <svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>close [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="close-[#ffffff]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> </polygon> </g> </g> </g> </g></svg>
            </Dialog.Close>
            <div className="flex items-center space-x-2">
                <svg width="54px" height="54px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="17" r="1" fill="#ffffff"></circle> <path d="M12 10L12 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3.44722 18.1056L10.2111 4.57771C10.9482 3.10361 13.0518 3.10362 13.7889 4.57771L20.5528 18.1056C21.2177 19.4354 20.2507 21 18.7639 21H5.23607C3.7493 21 2.78231 19.4354 3.44722 18.1056Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <h2 className="text-3xl mt-3">Warning</h2>
            </div>

            <p>Are you sure you want to delete this review?</p>

            <div className={`flex flex-col overflow-scroll no-scrollbar space-y-2 h-42 p-4 mb-8 rounded-lg bg-black/50 shadow-lg border 
                    ${review.recommended ? "cardReviewGreen shadow-green-500/30 border-green-600" : "cardReviewRed shadow-rose-500/30 border-rose-700"}`} >
                <div className='relative flex items-center text-white'>
                    {review.recommended ?
                        <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#15cc67ff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                        :
                        <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>dislike [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -760.000000)" fill="#e02020ff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M139.800374,612 L144.00037,612 L144.00037,600 L139.800374,600 L139.800374,612 Z M127.698085,600 L137.700376,600 L137.700376,611.979 L135.894378,618.174 C135.725328,619.224 134.776129,620 133.66103,620 C132.412581,620 131.400381,619.036 131.400381,617.847 L131.400381,612 L125.873186,612 C124.026238,612 122.659139,610.358 123.074939,608.644 L124.899837,602.109 C125.200137,600.868 126.360386,600 127.698085,600 L127.698085,600 Z" id="dislike-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                    }
                    <div className="flex items-center hover:text-green-400 ml-1 cursor-pointer">
                        <div className="w-8 h-8 rounded rounded-full overflow-hidden mr-2">
                            <img src={`/avatarImages/${review.avatar_image}`} className="h-full w-full object-cover" alt="User avatar" />
                        </div>
                        {review.user_name}
                    </div>

                </div>
                <span className='h-[1px] w-full bg-gray-600'></span>
                <div className='h-full'>
                    <p>{review.body}</p>
                </div>
            </div>

            <div className="flex items-center space-x-8 mt-10">
                <button onClick={handleDeleteReview} className="text-md sm:text-lg border-green-500 text-green-400 hover:bg-green-900/30 rounded-xl px-5 py-2 md:px-6 md:py-3">Delete</button>
                <Dialog.Close className="text-md sm:text-lg text-white px-5 py-2 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                    Cancel
                </Dialog.Close>
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </div>
    )
}