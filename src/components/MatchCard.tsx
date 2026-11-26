"use client"
import React, { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { MatchCandidate } from '@/types/MatchCandidate'

// Distance (px) or speed (px/s) needed to swipe the card when the user releases it
const SWIPE_DISTANCE = 120
const SWIPE_VELOCITY = 600

/**
 * Card of a match candidate. The top card can be dragged left (pass) or right (like).
 * forcedSwipe swipes the card from outside (buttons and keyboard).
 */
export default function MatchCard({ candidate, isTop, forcedSwipe, onSwipe }: {
    candidate: MatchCandidate,
    isTop: boolean,
    forcedSwipe: 'left' | 'right' | null,
    onSwipe: (liked: boolean) => void,
}) {
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-300, 300], [-18, 18])
    const likeOpacity = useTransform(x, [30, SWIPE_DISTANCE], [0, 1])
    const passOpacity = useTransform(x, [-SWIPE_DISTANCE, -30], [1, 0])
    const isSwiping = useRef(false)

    function swipeOut(liked: boolean) {
        if (isSwiping.current) return
        isSwiping.current = true
        animate(x, liked ? 700 : -700, { duration: 0.3, ease: 'easeIn' }).then(() => onSwipe(liked))
    }

    function handleDragEnd(_: any, info: PanInfo) {
        if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) {
            swipeOut(true)
        } else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) {
            swipeOut(false)
        } else {
            // Not enough: the card goes back to the center
            animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
        }
    }

    useEffect(() => {
        if (isTop && forcedSwipe) {
            swipeOut(forcedSwipe === 'right')
        }
    }, [forcedSwipe, isTop])

    const avatarUrl = candidate.user_avatar ? `https://media.statrix.app/avatars/${candidate.user_id}/${candidate.user_avatar}` : "/avatarImages/avatar_default.jpg"
    const bannerUrl = candidate.user_banner ? `https://media.statrix.app/banners/${candidate.user_id}/${candidate.user_banner}` : "/bannerImages/banner_default.jpg"

    return (
        <motion.div style={{ x, rotate }} drag={isTop ? 'x' : false} dragMomentum={false} onDragEnd={handleDragEnd}
            className={`absolute inset-0 flex flex-col rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/60 overflow-hidden select-none transition-[scale,translate,opacity] duration-300
            ${isTop ? 'cursor-grab active:cursor-grabbing' : 'scale-95 translate-y-4 opacity-60 pointer-events-none'}`}>

            {/* Like / pass stamps, visible while dragging */}
            <motion.div style={{ opacity: likeOpacity }} className='absolute top-8 left-6 z-10 -rotate-12 px-3 py-1 rounded-lg border-4 border-green-400 text-green-400 text-3xl font-black tracking-wider pointer-events-none'>
                LIKE
            </motion.div>
            <motion.div style={{ opacity: passOpacity }} className='absolute top-8 right-6 z-10 rotate-12 px-3 py-1 rounded-lg border-4 border-rose-500 text-rose-500 text-3xl font-black tracking-wider pointer-events-none'>
                PASS
            </motion.div>

            {/* Banner and avatar */}
            <div className='relative h-32 shrink-0'>
                <img src={bannerUrl} draggable={false} className='h-full w-full object-cover' alt='Banner image' />
                <div className='absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent' />
                <div className='absolute -bottom-10 left-5 w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-900 shadow-xl'>
                    <img src={avatarUrl} draggable={false} className='h-full w-full object-cover' alt='Avatar image' />
                </div>
            </div>

            {/* User info */}
            <div className='flex flex-col gap-1 px-5 pt-12'>
                <p className='text-2xl font-bold truncate'>{candidate.user_name}</p>
                {candidate.user_location &&
                    <p className='flex items-center gap-1 text-sm text-zinc-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        {candidate.user_location}
                    </p>}
                {candidate.user_bio &&
                    <p className='mt-1 text-sm text-zinc-300 line-clamp-3'>{candidate.user_bio}</p>}
            </div>

            {/* Games in common */}
            <div className='mt-auto px-5 pb-5 pt-4'>
                <p className='mb-2 text-sm font-semibold text-green-400'>
                    {candidate.common_games} {candidate.common_games === 1 ? 'game' : 'games'} in common
                </p>
                <div className='grid grid-cols-6 gap-1.5'>
                    {candidate.shared_games.map(game => (
                        <div key={game.game_id} title={game.game_name} className='relative aspect-[3/4] rounded-md overflow-hidden bg-zinc-800 ring-1 ring-white/10'>
                            {game.game_base_image &&
                                <img src={game.game_base_image.replace("t_720p", "t_cover_big")} draggable={false} className='h-full w-full object-cover' alt={game.game_name} />}
                            {game.favourite &&
                                <span className='absolute top-0.5 right-0.5 text-[10px] text-yellow-400 drop-shadow'>★</span>}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
