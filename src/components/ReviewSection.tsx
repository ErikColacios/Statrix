"use client"
import React, { useState } from "react"
import getGameReviews from "../actions/getGameReviews"
import { ReviewMode } from "../enums/ReviewMode"
import Link from "next/link"
import deleteLikeReview from "../actions/deleteLikeReview"
import insertLikeReview from "../actions/insertLikeReview"
import { useSession } from "next-auth/react"

type Props = {
    gameReviews: any[]
    gameId: number
}

export default function ReviewSection({ gameReviews, gameId }: Props) {

    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    const [reviews, setReviews] = useState<any[]>(gameReviews)
    const [reviewModeSelected, setReviewModeSelected] = useState<ReviewMode>(ReviewMode.POPULAR)

    async function loadReviews(reviewMode: ReviewMode) {
        let gameReviewsNew: any[] = await getGameReviews(gameId, reviewMode)
        setReviews(gameReviewsNew)
        setReviewModeSelected(reviewMode)
    }

    async function handleLikeReview(likeUnlike: string, review_id: any) {

        if (likeUnlike === "like") {
            await insertLikeReview(review_id)
        }
        else if (likeUnlike === "unlike") {
            await deleteLikeReview(review_id)
        }
    }


    return (
        <section className='pt-6 sm:pt-14 md:pt-5'>
            <div className='relative flex flex-col'>
                <div className="flex text-base">
                    <button className={`pl-4 pt-1 pr-4 pb-1 transition hover:bg-gray-600 ${reviewModeSelected === ReviewMode.POPULAR ? 'bg-zinc-900' : 'bg-transparent'}`} onClick={() => loadReviews(ReviewMode.POPULAR)}>Popular reviews</button>
                    <button className={`pl-4 pt-1 pr-4 pb-1 transition hover:bg-gray-600 ${reviewModeSelected === ReviewMode.RECENT ? 'bg-zinc-900' : 'bg-transparent'}`} onClick={() => loadReviews(ReviewMode.RECENT)}>Recent reviews</button>
                </div>
            </div>
            <div className='bg-zinc-900 p-4'>
                {reviews?.map((r: any, index: number) => (
                    <div className={`flex flex-col overflow-scroll no-scrollbar space-y-2 h-42 p-4 mb-8 rounded-lg bg-black/50 shadow-lg border 
                            ${r.recommended ? "cardReviewGreen shadow-green-500/30 border-green-600" : "cardReviewRed shadow-rose-500/30 border-rose-700"}`} key={index}>
                        <div className='flex items-center text-white'>
                            {r.recommended ?
                                <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#15cc67ff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                :
                                <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>dislike [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -760.000000)" fill="#e02020ff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M139.800374,612 L144.00037,612 L144.00037,600 L139.800374,600 L139.800374,612 Z M127.698085,600 L137.700376,600 L137.700376,611.979 L135.894378,618.174 C135.725328,619.224 134.776129,620 133.66103,620 C132.412581,620 131.400381,619.036 131.400381,617.847 L131.400381,612 L125.873186,612 C124.026238,612 122.659139,610.358 123.074939,608.644 L124.899837,602.109 C125.200137,600.868 126.360386,600 127.698085,600 L127.698085,600 Z" id="dislike-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                            }
                            {/* User reviewer button */}
                            <Link href={`/profile/${r.user_name}`} className="flex items-center hover:text-green-400 ml-1 cursor-pointer">
                                <div className="w-8 h-8 rounded rounded-full overflow-hidden mr-2">
                                    <img src={`/avatarImages/${r.avatar_image}`} className="h-full w-full object-cover" alt="User avatar"/>
                                </div>
                                {r.user_name}
                            </Link>
                            <span className="ml-8">Review date: {r.review_date.toLocaleDateString()}</span>
                            {/* Like button */}
                            {r.liked_by_user == 1 ?
                                <div className="flex items-center ml-auto pr-2 text-xs">
                                    <svg width="20px" height="10px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#ffffffff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                    {r.likes}
                                    <button className="flex items-center transition bg-gray-800 hover:bg-gray-600 ml-1 p-1 rounded"
                                        onClick={() => handleLikeReview("unlike", r.review_id)}>
                                        Unlike
                                    </button>
                                </div>
                                :
                                <div className="flex items-center ml-auto pr-2 text-xs">
                                    <svg width="20px" height="10px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#ffffffff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                    {r.likes}

                                    {userId && <button className="flex items-center transition bg-gray-800 hover:bg-gray-600 ml-1 p-1 rounded"
                                        onClick={() => handleLikeReview("like", r.review_id)}>
                                        Like this!
                                    </button>}
                                </div>
                            }

                        </div>
                        <span className='h-[1px] w-full bg-gray-600'></span>
                        <div className='h-full'>
                            <p>{r.body}</p>
                        </div>
                    </div>
                ))}

                {!gameReviews.length && (
                    <div className='flex justify-center items-center text-center text-gray-300 p-2 h-36 border border-gray-500'>
                        <p>There are no reviews of this game yet... Add the first one!</p>
                    </div>
                )}
            </div>
        </section>
    )
}