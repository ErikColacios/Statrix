'use client'
import React, { useEffect, useState } from 'react'
import getGameReviews from '../actions/getGameReviews'
import { useSession } from 'next-auth/react'
import { ReviewMode } from '../enums/ReviewMode'
import insertLikeReview from '../actions/insertLikeReview'
import deleteLikeReview from '../actions/deleteLikeReview'
import { Dialog } from 'radix-ui'
import ReviewModal from './ReviewModal'
import DeleteReviewModal from './DeleteReviewModal'
import ReviewCard from './ReviewCard'

type Props = {
    gameReviews: any[]
    gameId: number
    gameName: string
    coverImageId: string
}

export default function ReviewSection({ gameReviews, gameId, gameName, coverImageId }: Props) {
    // Session and user
    const session: any = useSession()
    const userId: string = session?.data?.user?.id as string

    const [openReviewId, setOpenReviewId] = useState<string | null>(null)
    const [modalType, setModalType] = useState<string>('')
    const [reviewClicked, setReviewClicked] = useState([])

    // Review items
    const [reviews, setReviews] = useState<any[]>(gameReviews)
    const [reviewModeSelected, setReviewModeSelected] = useState<ReviewMode>(ReviewMode.POPULAR)

    async function loadReviews(reviewMode: ReviewMode) {
        let gameReviewsNew: any[] = await getGameReviews(gameId, reviewMode)
        setReviews(gameReviewsNew)
        setReviewModeSelected(reviewMode)
    }

    async function handleLikeReview(likeUnlike: string, reviewId: any) {
        if (likeUnlike === 'like') {
            const likeCountElement = document.getElementById('likeCount' + reviewId)
            const likeButtonImageElement = document.getElementById('likeButtonImage' + reviewId) as HTMLImageElement
            if (likeCountElement && likeButtonImageElement) {
                const currentLikeCount = parseInt(likeCountElement.textContent || '0')
                likeCountElement.textContent = (currentLikeCount + 1).toString()
                likeButtonImageElement.src = '/staticImages/icon_heart_red.png'
                reviews.find(review => review.review_id === reviewId).liked_by_user = 1
            }

            await insertLikeReview(reviewId, gameId)
        } else if (likeUnlike === 'unlike') {
            const likeCountElement = document.getElementById('likeCount' + reviewId)
            const likeButtonImageElement = document.getElementById('likeButtonImage' + reviewId) as HTMLImageElement
            if (likeCountElement && likeButtonImageElement) {
                const currentLikeCount = parseInt(likeCountElement.textContent || '0')
                if (currentLikeCount > 0) {
                    likeCountElement.textContent = (currentLikeCount - 1).toString()
                    likeButtonImageElement.src = '/staticImages/icon_heart_gray.png'
                    reviews.find(review => review.review_id === reviewId).liked_by_user = 0
                }
            }
            await deleteLikeReview(reviewId, gameId)
        }
    }

    function handleReviewActions(reviewId: string) {
        setOpenReviewId(current => (current === reviewId ? null : reviewId))
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
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openReviewId])

    return (
        <section className="py-6">
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content
                        className={`fixed z-50 flex justify-center w-full md:w-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl 
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}
                    >
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {modalType === 'addReview' && <ReviewModal gameId={gameId} gameName={gameName} gameCover={coverImageId} />}
                        {modalType === 'deleteReview' && (
                            <DeleteReviewModal review={reviewClicked} reviews={reviews} setReviews={setReviews} />
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
                <div className="relative flex flex-col">
                    <div className="flex space-x-1 text-sm">
                        <button
                            className={`px-4 pt-1 pb-1 rounded transition hover:bg-zinc-900 ${reviewModeSelected === ReviewMode.POPULAR ? 'bg-zinc-900' : 'bg-transparent'}`}
                            onClick={() => loadReviews(ReviewMode.POPULAR)}>
                            Popular
                        </button>
                        <button
                            className={`px-4 pt-1 pb-1 rounded transition hover:bg-zinc-900 ${reviewModeSelected === ReviewMode.RECENT ? 'bg-zinc-900' : 'bg-transparent'}`}
                            onClick={() => loadReviews(ReviewMode.RECENT)}>
                            Recent
                        </button>
                        <Dialog.Trigger
                            onClick={() => setModalType('addReview')}
                            className="ml-auto mb-2 rounded-sm px-2 py-1 bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                            + Add review
                        </Dialog.Trigger>
                    </div>
                </div>
                <div className="pt-4">
                    {/* Review cards */}
                    {reviews?.map((review: any, index: number) => (
                        <ReviewCard key={index} review={review} index={index} gameName={gameName} userId={userId} handleReviewActions={handleReviewActions}
                            openReviewId={openReviewId} handleLikeReview={handleLikeReview} setModalType={setModalType} setReviewClicked={setReviewClicked} />
                    ))}
                    {!gameReviews.length && (
                        <div className="flex flex-col justify-center items-center rounded text-center text-gray-400 text-sm p-2 h-36 border border-gray-600">
                            <p>No reviews of this game yet.</p>
                            <p>Add the first one!</p>
                        </div>
                    )}
                </div>
            </Dialog.Root>
        </section>
    )
}