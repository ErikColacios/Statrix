'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import insertLikeReview from '@/actions/insertLikeReview'
import deleteLikeReview from '@/actions/deleteLikeReview'

type Props = {
    reviewId: string,
    gameId: number,
    initialLikes: number,
    initialLiked: boolean,
    isLogged: boolean
}

export default function LikeReviewButton({ reviewId, gameId, initialLikes, initialLiked, isLogged }: Props) {
    const [likes, setLikes] = useState<number>(initialLikes)
    const [liked, setLiked] = useState<boolean>(initialLiked)

    async function handleLike() {
        // Optimistic update, the counter changes before the DB answers
        if (liked) {
            setLiked(false)
            setLikes(current => Math.max(current - 1, 0))
            await deleteLikeReview(reviewId, gameId)
        } else {
            setLiked(true)
            setLikes(current => current + 1)
            await insertLikeReview(reviewId, gameId)
        }
    }

    const content = (
        <>
            <img src={`/staticImages/${liked ? 'icon_heart_red.png' : 'icon_heart_gray.png'}`} alt="Like icon" className="w-4 h-4" />
            <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
        </>
    )
    const classes = "inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm text-gray-400 bg-zinc-800/60 hover:bg-zinc-800 hover:text-white transition"

    // Without session the button takes you to the login
    if (!isLogged) {
        return <Link href="/login" className={classes}>{content}</Link>
    }

    return <button type="button" onClick={handleLike} className={classes}>{content}</button>
}
