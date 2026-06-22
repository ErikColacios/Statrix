"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import getGameReviews from "../actions/getGameReviews"
import { useSession } from "next-auth/react"
import { ReviewMode } from "../enums/ReviewMode"
import insertLikeReview from "../actions/insertLikeReview"
import deleteLikeReview from "../actions/deleteLikeReview"
import { Dialog } from "radix-ui"
import ReviewModal from "./ReviewModal"
import DeleteReviewModal from "./DeleteReviewModal"

type Props = {
    gameReviews: any[]
    gameId: number,
    gameName: string,
    coverImageId: string
}

export default function ReviewSection({ gameReviews, gameId, gameName, coverImageId }: Props) {

    // Session and user
    const session: any = useSession();
    const userId: string = session?.data?.user?.id as string;
    
    const [openReviewId, setOpenReviewId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<string>("")
    const [reviewClicked, setReviewClicked] = useState([])

    // Review items
    const [reviews, setReviews] = useState<any[]>(gameReviews)
    const [reviewModeSelected, setReviewModeSelected] = useState<ReviewMode>(ReviewMode.POPULAR)

    // Date formatter
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "short" });


    async function loadReviews(reviewMode: ReviewMode) {
        let gameReviewsNew: any[] = await getGameReviews(gameId, reviewMode)
        setReviews(gameReviewsNew)
        setReviewModeSelected(reviewMode)
    }

    async function handleLikeReview(likeUnlike: string, reviewId: any) {
        if (likeUnlike === "like") {
            const likeCountElement = document.getElementById("likeCount" + reviewId)
            const likeButtonElement = document.getElementById("likeButton" + reviewId)
            if (likeCountElement && likeButtonElement) {
                const currentLikeCount = parseInt(likeCountElement.textContent || "0")
                likeCountElement.textContent = (currentLikeCount + 1).toString()
                likeButtonElement.textContent = "Unlike"
                reviews.find((review) => review.review_id === reviewId).liked_by_user = 1
            }

            await insertLikeReview(reviewId, gameId)
        }
        else if (likeUnlike === "unlike") {
            const likeCountElement = document.getElementById("likeCount" + reviewId)
            const likeButtonElement = document.getElementById("likeButton" + reviewId)
            if (likeCountElement && likeButtonElement) {
                const currentLikeCount = parseInt(likeCountElement.textContent || "0")
                if (currentLikeCount > 0) {
                    likeCountElement.textContent = (currentLikeCount - 1).toString()
                    likeButtonElement.textContent = "Like this!"
                    reviews.find((review) => review.review_id === reviewId).liked_by_user = 0
                }
            }
            await deleteLikeReview(reviewId, gameId)
        }
    }

    function handleReviewActions(reviewId: string) {
        setOpenReviewId(current => current === reviewId ? null : reviewId)
    }

    function handleClickOutside(e: MouseEvent) {
        const target = e.target as Node
        const dropdown = document.querySelector(`[data-review-dropdown="${openReviewId}"]`)
        const button = document.querySelector(`[data-review-button="${openReviewId}"]`)

        if (dropdown && !dropdown.contains(target) && button && !button.contains(target)) {
            setOpenReviewId(null)
        }
    }

    useEffect(() => {
        if (openReviewId) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openReviewId])

    
    return (
        <section className='pt-6 py-14 md:pt-8'>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className={`fixed flex justify-center w-full md:w-[50rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl 
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {modalType === "addReview" && (
                            <ReviewModal gameId={gameId} gameName={gameName} gameCover={coverImageId} />

                        )}
                        {modalType === "deleteReview" && (
                            <DeleteReviewModal review={reviewClicked} reviews={reviews} setReviews={setReviews} />
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
                <div className='relative flex flex-col'>
                    <div className="flex text-sm">
                        <button className={`pl-4 pt-1 pr-4 pb-1 transition hover:bg-gray-600 ${reviewModeSelected === ReviewMode.POPULAR ? 'bg-zinc-900' : 'bg-transparent'}`} onClick={() => loadReviews(ReviewMode.POPULAR)}>Popular reviews</button>
                        <button className={`pl-4 pt-1 pr-4 pb-1 transition hover:bg-gray-600 ${reviewModeSelected === ReviewMode.RECENT ? 'bg-zinc-900' : 'bg-transparent'}`} onClick={() => loadReviews(ReviewMode.RECENT)}>Recent reviews</button>
                        <Dialog.Trigger onClick={() => setModalType("addReview")} className='ml-auto mb-2 rounded px-2 py-1 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300'>
                            + Add review
                        </Dialog.Trigger>
                    </div>

                </div>
                <div className='bg-zinc-900 p-4'>
                    {reviews?.map((review: any, index: number) => (
                        <div className={`flex flex-col overflow-scroll no-scrollbar space-y-2 h-42 p-4 mb-8 rounded-lg bg-black/50 shadow-lg border 
                            ${review.recommended ? "cardReviewGreen shadow-green-500/30 border-green-600" : "cardReviewRed shadow-rose-500/30 border-rose-700"}`} key={index}>
                            <div className='relative flex items-center text-white'>
                                {review.recommended ?
                                    <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#15cc67ff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                    :
                                    <svg className="pr-2" width="25px" height="15px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>dislike [#ffffff]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -760.000000)" fill="#e02020ff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M139.800374,612 L144.00037,612 L144.00037,600 L139.800374,600 L139.800374,612 Z M127.698085,600 L137.700376,600 L137.700376,611.979 L135.894378,618.174 C135.725328,619.224 134.776129,620 133.66103,620 C132.412581,620 131.400381,619.036 131.400381,617.847 L131.400381,612 L125.873186,612 C124.026238,612 122.659139,610.358 123.074939,608.644 L124.899837,602.109 C125.200137,600.868 126.360386,600 127.698085,600 L127.698085,600 Z" id="dislike-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                }
                                {/* User reviewer button */}
                                <Link href={`/profile/${review.user_name}`} className="flex items-center hover:text-green-400 ml-1 cursor-pointer">
                                    <div className="w-8 h-8 rounded rounded-full overflow-hidden mr-2">
                                        <img src={`/avatarImages/${review.avatar_image}`} className="h-full w-full object-cover" alt="User avatar" />
                                    </div>
                                    {review.user_name}
                                </Link>
                                <span className="text-xs text-gray-300 ml-1 sm:ml-8" suppressHydrationWarning >{formatter.format(review.review_date)}</span>
                                {/* Like button */}
                                <div className="flex items-center ml-auto pr-2 text-xs">
                                    <svg width="20px" height="10px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>like [#ffffff]</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)" fill="#ffffffff"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#ffffff]"> </path> </g> </g> </g> </g></svg>
                                    <span id={"likeCount" + review.review_id}>{review.likes}</span>

                                    {/* Review actions dropdown */}
                                    {openReviewId && openReviewId === review.review_id && (
                                        <div data-review-dropdown={review.review_id} id={"reviewActions" + review.review_id} className="top-0 right-10 absolute flex flex-col bg-gray-800 p-2 rounded">
                                            {/* <button className="text-left p-1 hover:text-green-400">Edit review</button> */}
                                            <Dialog.Trigger onClick={() => {setModalType("deleteReview"), setReviewClicked(review)}} className="text-left p-1 hover:text-green-400">Delete review</Dialog.Trigger>
                                        </div>
                                    )}

                                    {/* Review actions button */}
                                    {review.user_id === userId ?
                                        <div data-review-button={review.review_id} onClick={() => handleReviewActions(review.review_id)} ><svg className="flex items-center cursor-pointer transition bg-gray-800 hover:bg-gray-600 ml-4 p-1 rounded" fill="#ffffff" width="22px" height="22px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M28.106 19.944h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.788-0.275-3.2-1.762-3.319-3.506-0.137-1.95 0.975-3.6 2.787-4.137 0.238-0.069 0.488-0.119 0.731-0.181h0.85c0.056 0.019 0.106 0.050 0.169 0.056 1.65 0.269 2.906 1.456 3.262 3.081 0.025 0.125 0.063 0.25 0.094 0.375v0.85c-0.019 0.056-0.050 0.113-0.056 0.169-0.262 1.625-1.419 2.863-3.025 3.238-0.156 0.038-0.3 0.081-0.444 0.119zM4.081 12.056l0.85 0c0.069 0.019 0.131 0.050 0.2 0.056 1.8 0.281 3.206 1.775 3.319 3.537 0.125 1.944-1 3.588-2.819 4.119-0.231 0.069-0.469 0.119-0.7 0.175h-0.85c-0.056-0.019-0.106-0.050-0.162-0.063-1.625-0.3-2.688-1.244-3.194-2.819-0.069-0.206-0.106-0.425-0.162-0.637v-0.85c0.019-0.056 0.050-0.113 0.056-0.169 0.269-1.631 1.419-2.863 3.025-3.238 0.15-0.037 0.294-0.075 0.437-0.113zM15.669 12.056h0.85c0.069 0.019 0.131 0.050 0.2 0.063 1.794 0.281 3.238 1.831 3.313 3.581 0.087 1.969-1.1 3.637-2.931 4.106-0.194 0.050-0.387 0.094-0.581 0.137h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.794-0.275-3.238-1.831-3.319-3.581-0.094-1.969 1.1-3.637 2.931-4.106 0.2-0.050 0.394-0.094 0.588-0.137z"></path> </g></svg></div>
                                        :
                                        <button id={"likeButton" + review.review_id} className="flex items-center transition bg-gray-800 hover:bg-gray-600 ml-1 p-1 rounded"
                                            onClick={() => { review.liked_by_user == 1 ? handleLikeReview("unlike", review.review_id) : handleLikeReview("like", review.review_id) }
                                            }>
                                            {review.liked_by_user == 1 ? "Unlike" : "Like!"}
                                        </button>}
                                </div>
                            </div>
                            <span className='h-[1px] w-full bg-gray-600'></span>
                            <div className='h-full'>
                                <p>{review.body}</p>
                            </div>
                        </div>
                    ))}

                    {!gameReviews.length && (
                        <div className='flex justify-center items-center text-center text-gray-300 p-2 h-36 border border-gray-500'>
                            <p>There are no reviews of this game yet... Add the first one!</p>
                        </div>
                    )}
                </div>
            </Dialog.Root>
        </section>
    )
}