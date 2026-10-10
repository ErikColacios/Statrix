import React from 'react'
import Link from 'next/link'
import { Dialog } from 'radix-ui'

export default function ReviewCard({ review, index, gameName, userId, handleReviewActions, openReviewId, handleLikeReview, setModalType, setReviewClicked}: any) {
    
    // Date formatter
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

    return (
        <div key={index}
            className={`flex flex-col space-y-2 min-h-36 p-4 mb-8 rounded-lg bg-black/50 shadow-lg border 
                            ${review.game_score >= 8 ? ' cardReviewGreen shadow-green-500/30 border-green-600' : ''}
                            ${review.game_score >= 4 && review.game_score < 8 ? ' cardReviewYellow shadow-yellow-500/30 border-yellow-700' : ''}
                            ${review.game_score < 4 && review.game_score > 0 ? ' cardReviewRed shadow-rose-500/30 border-rose-700' : ''}
                            ${Number(review.game_score) === 0 ? 'bg-zinc-900/80 shadow-zinc-500/30 border-gray-800' : ''}
                            `}>
            <div className="relative flex flex-col space-y-1">
                <div className="flex flex-col space-x-2 sm:flex-row sm:items-center text-white">
                    <Link href={`/profile/${review.user_name}`} className="flex items-center hover:text-green-400 cursor-pointer">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img src={`/avatarImages/${review.avatar_image}`} className="h-full w-full object-cover" alt="User avatar" />
                        </div>
                        <p className="font-bold">{review.user_name}</p>
                        <p className="ml-2 text-gray-400">reviewed </p>
                    </Link>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <p className="font-bold">{gameName}</p>
                        <p className={`flex justify-center items-center rounded-full w-8 h-8 font-bold border
                                        ${review.game_score >= 8 ? 'text-green-400 border-green-600' : ''}
                                                ${review.game_score >= 4 && review.game_score < 8 ? 'text-yellow-400 border-yellow-700' : ''}
                                                ${review.game_score < 4 && review.game_score > 0 ? 'text-rose-400 border-rose-700' : ''}
                                                ${Number(review.game_score) === 0 ? 'text-gray-300 border-gray-400' : ''}
                                        `}>
                            {Number(review.game_score) === 0 ? "NS" : review.game_score}
                        </p>
                    </div>

                    <div className="absolute right-0 mt-1 flex items-center space-x-2 text-sm">
                        {/* Review actions button */}
                        {review.user_id === userId &&
                            <div data-review-button={review.review_id} onClick={() => handleReviewActions(review.review_id)}>
                                <svg className="flex items-center cursor-pointer transition bg-zinc-800 hover:bg-zinc-700 ml-4 p-1 rounded-sm" fill="#ffffff" width="22px" height="22px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">{' '}<path d="M28.106 19.944h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.788-0.275-3.2-1.762-3.319-3.506-0.137-1.95 0.975-3.6 2.787-4.137 0.238-0.069 0.488-0.119 0.731-0.181h0.85c0.056 0.019 0.106 0.050 0.169 0.056 1.65 0.269 2.906 1.456 3.262 3.081 0.025 0.125 0.063 0.25 0.094 0.375v0.85c-0.019 0.056-0.050 0.113-0.056 0.169-0.262 1.625-1.419 2.863-3.025 3.238-0.156 0.038-0.3 0.081-0.444 0.119zM4.081 12.056l0.85 0c0.069 0.019 0.131 0.050 0.2 0.056 1.8 0.281 3.206 1.775 3.319 3.537 0.125 1.944-1 3.588-2.819 4.119-0.231 0.069-0.469 0.119-0.7 0.175h-0.85c-0.056-0.019-0.106-0.050-0.162-0.063-1.625-0.3-2.688-1.244-3.194-2.819-0.069-0.206-0.106-0.425-0.162-0.637v-0.85c0.019-0.056 0.050-0.113 0.056-0.169 0.269-1.631 1.419-2.863 3.025-3.238 0.15-0.037 0.294-0.075 0.437-0.113zM15.669 12.056h0.85c0.069 0.019 0.131 0.050 0.2 0.063 1.794 0.281 3.238 1.831 3.313 3.581 0.087 1.969-1.1 3.637-2.931 4.106-0.194 0.050-0.387 0.094-0.581 0.137h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.794-0.275-3.238-1.831-3.319-3.581-0.094-1.969 1.1-3.637 2.931-4.106 0.2-0.050 0.394-0.094 0.588-0.137z"></path>{' '}</g></svg>
                            </div>
                        }

                        <div className="flex space-x-2 items-center text-white">
                            {/* Like button */}
                            <div className="flex items-center ml-auto pr-2 text-xs">
                                <button id={'likeButton' + review.review_id} onClick={() =>  {
                                    review.liked_by_user == 1
                                        ? handleLikeReview('unlike', review.review_id)
                                        : handleLikeReview('like', review.review_id)
                                }}>
                                    <img id={'likeButtonImage' + review.review_id} src={`/staticImages/${review.liked_by_user == 1 ? 'icon_heart_red.png' : 'icon_heart_gray.png'}`} alt="Liked icon" className="w-4 h-4 mr-1" />
                                </button>
                                <span className="text-gray-400" id={'likeCount' + review.review_id}>
                                    {review.likes}
                                </span>

                                {/* Review actions dropdown */}
                                {openReviewId && openReviewId === review.review_id && (
                                    <div
                                        data-review-dropdown={review.review_id}
                                        id={'reviewActions' + review.review_id}
                                        className="w-24 top-6 right-5 absolute bg-zinc-800 p-2 rounded-sm"
                                    >
                                        {/* <button className="text-left p-1 hover:text-green-400">Edit review</button> */}
                                        <Dialog.Trigger
                                            onClick={() => {(setModalType('deleteReview'), setReviewClicked(review))}}
                                            className="hover:text-green-400">
                                            Delete review
                                        </Dialog.Trigger>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <span className="text-sm text-gray-400" suppressHydrationWarning>
                    {formatter.format(review.review_date)}
                </span>
            </div>
            <div className="max-h-64 overflow-hidden no-scrollbar py-2">
                <p>{review.body}</p>
            </div>
        </div>
    )
}