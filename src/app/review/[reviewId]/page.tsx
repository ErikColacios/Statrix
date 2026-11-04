import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import getReview from '@/actions/getReview'
import getSessionUser from '@/actions/getSessionUser'
import BackLink from '@/components/BackLink'
import LikeReviewButton from '@/components/LikeReviewButton'

export async function generateMetadata({ params }: { params: { reviewId: string } }): Promise<Metadata> {
    const review = await getReview(params.reviewId)
    if (!review) return { title: 'Review - Statrix' }

    const title = `${review.user_name}'s review of ${review.game_name} - Statrix`
    const description = review.body.length > 160 ? `${review.body.slice(0, 157)}...` : review.body

    return {
        title,
        description,
        openGraph: { type: 'article', siteName: 'Statrix', title, description, images: [review.game_base_image] },
        twitter: { card: 'summary', title, description },
    }
}

// Same colors as the review cards of the game page
function scoreClasses(score: number) {
    if (score >= 8) return 'text-green-400 border-green-600'
    if (score >= 4) return 'text-yellow-400 border-yellow-700/80'
    if (score > 0) return 'text-rose-400 border-rose-700'
    return 'text-gray-300 border-white/10'
}

function cardClasses(score: number) {
    if (score >= 8) return 'cardReviewGreen shadow-green-500/30 border-green-600'
    if (score >= 4) return 'cardReviewYellow shadow-yellow-500/30 border-yellow-700/80'
    if (score > 0) return 'cardReviewRed shadow-rose-500/30 border-rose-700'
    return 'bg-zinc-900/80 shadow-zinc-500/30 border-white/10'
}

export default async function Review({ params }: { params: { reviewId: string } }) {

    const [review, session] = await Promise.all([getReview(params.reviewId), getSessionUser()])
    if (!review) notFound()

    const score = Number(review.game_score)
    const reviewDate = new Date(review.review_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

    return (
        <div className='w-full sm:w-5/6 lg:w-3/5 2xl:w-2/5 px-4 pt-20 pb-8'>
            <BackLink href={`/gamePage/${review.game_id}`}>Back to {review.game_name}</BackLink>

            <article className={`mt-6 rounded-lg border bg-zinc-900/80 shadow-lg p-4 sm:p-6 ${cardClasses(score)}`}>
                <div className="flex gap-4 sm:gap-6">
                    {/* Game cover */}
                    <Link href={`/gamePage/${review.game_id}`} className="shrink-0">
                        <img src={review.game_base_image} className="w-20 h-28 sm:w-28 sm:h-38 object-cover rounded-md border border-white/10 transition hover:border-green-400" alt="Game cover" />
                    </Link>

                    <div className="flex flex-col min-w-0">
                        {/* Author */}
                        <Link href={`/profile/${review.user_name}`} className="group flex items-center w-fit">
                            <img
                                src={review.user_avatar ? `https://media.statrix.app/avatars/${review.user_id}/${review.user_avatar}` : "/avatarImages/avatar_default.jpg"}
                                className="w-8 h-8 rounded-full object-cover mr-2 ring-2 ring-white/10 transition group-hover:ring-green-400"
                                alt="User avatar" />
                            <span className="font-bold group-hover:text-green-400">{review.user_name}</span>
                            <span className="ml-2 text-gray-400">reviewed</span>
                        </Link>

                        {/* Game and score */}
                        <div className="flex items-center gap-3 mt-3">
                            <Link href={`/gamePage/${review.game_id}`} className="text-2xl sm:text-3xl font-semibold text-balance hover:text-green-400">
                                {review.game_name}
                            </Link>
                            <span className={`flex shrink-0 justify-center items-center rounded-full w-10 h-10 font-bold border ${scoreClasses(score)}`}>
                                {score === 0 ? 'NS' : score}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-400">{reviewDate}</p>
                    </div>
                </div>

                {/* Full review, keeping the line breaks the user wrote */}
                <p className="mt-6 text-base leading-relaxed whitespace-pre-line break-words">{review.body}</p>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <LikeReviewButton
                        reviewId={review.review_id}
                        gameId={review.game_id}
                        initialLikes={Number(review.likes)}
                        initialLiked={Number(review.liked_by_user) === 1}
                        isLogged={!!session} />
                </div>
            </article>
        </div>
    )
}
