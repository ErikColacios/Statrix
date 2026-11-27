"use client"
import React, { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { MatchCandidate } from '@/types/MatchCandidate'

// Distance (px) or speed (px/s) needed to swipe the card when the user releases it
const SWIPE_DISTANCE = 120
const SWIPE_VELOCITY = 600

function formatNumber(n: number) {
    return Math.round(Number(n) || 0).toLocaleString("en-US")
}

/**
 * Card of a match candidate, with the same bento design as the share card of the profile.
 * The top card can be dragged left (pass) or right (like).
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
    const mostPlayed = candidate.most_played
    const totalHours = formatNumber(candidate.total_hours)

    return (
        <motion.div style={{ x, rotate }} drag={isTop ? 'x' : false} dragMomentum={false} onDragEnd={handleDragEnd}
            className={`absolute inset-0 flex flex-col rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/60 overflow-hidden select-none transition-[scale,translate,opacity] duration-300
            ${isTop ? 'cursor-grab active:cursor-grabbing' : 'scale-95 translate-y-4 opacity-60 pointer-events-none'}`}>

            {/* The banner, blurred, tints the top of the card (like the share card) */}
            <img src={bannerUrl} draggable={false} className='absolute inset-x-0 top-0 h-1/2 w-full object-cover opacity-45 blur-2xl scale-110' alt='' aria-hidden="true" />
            <div className='absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-black/60 to-black' aria-hidden="true" />

            {/* Like / pass stamps, visible while dragging */}
            <motion.div style={{ opacity: likeOpacity }} className='absolute top-8 left-6 z-10 -rotate-12 px-3 py-1 rounded-lg border-4 border-green-400 bg-black/40 text-green-400 text-3xl font-black tracking-wider pointer-events-none'>
                LIKE
            </motion.div>
            <motion.div style={{ opacity: passOpacity }} className='absolute top-8 right-6 z-10 rotate-12 px-3 py-1 rounded-lg border-4 border-rose-500 bg-black/40 text-rose-500 text-3xl font-black tracking-wider pointer-events-none'>
                PASS
            </motion.div>

            <div className='relative flex flex-col h-full p-3 gap-2'>

                {/* Profile tile: banner with the avatar over its bottom edge and the name */}
                <div className='relative shrink-0 flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/70'>
                    <img src={bannerUrl} draggable={false} className='h-16 w-full object-cover' alt='Banner image' />
                    <img src={avatarUrl} draggable={false} className='absolute top-7 left-3 w-[4.5rem] h-[4.5rem] rounded-full border-4 border-zinc-950 object-cover' alt='Avatar image' />
                    <div className='flex flex-col min-h-12 pl-[5.75rem] pr-3 pt-1.5 pb-2.5'>
                        <p className='text-lg font-bold leading-tight truncate'>{candidate.user_name}</p>
                        {candidate.user_location &&
                            <p className='flex items-center gap-1 text-xs text-zinc-400 truncate'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                {candidate.user_location}
                            </p>}
                        {candidate.user_bio &&
                            <p className='mt-0.5 text-xs leading-snug text-zinc-400 line-clamp-2'>{candidate.user_bio}</p>}
                    </div>
                </div>

                {/* Most played game (cover) + hours played */}
                <div className='flex-1 min-h-0 flex gap-2'>
                    <div className='relative w-3/5 flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/70'>
                        {mostPlayed?.game_base_image &&
                            <img src={mostPlayed.game_base_image} draggable={false} className='absolute inset-0 h-full w-full object-cover' alt={mostPlayed.game_name} />}
                        <div className='absolute inset-0 bg-gradient-to-b from-transparent from-25% via-black/70 via-60% to-black' />
                        <div className='relative mt-auto p-3'>
                            <p className='text-xs text-zinc-300'>Most played</p>
                            {mostPlayed
                                ? <>
                                    <p className='mt-0.5 text-base font-bold leading-tight line-clamp-2'>{mostPlayed.game_name}</p>
                                    <p className='mt-0.5 text-xs text-green-500'>{formatNumber(mostPlayed.hours_played)} h played</p>
                                </>
                                : <p className='mt-0.5 text-sm text-zinc-400'>No played games yet</p>}
                        </div>
                    </div>

                    <div className='relative flex-1 flex flex-col justify-between p-3 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/70'>
                        <div className='absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.35)_0%,rgba(34,197,94,0)_70%)]' />
                        <p className='relative text-xs text-zinc-400'>Hours played</p>
                        <p className={`relative font-bold leading-none text-green-500 ${totalHours.length > 5 ? 'text-2xl' : 'text-4xl'}`}>{totalHours}</p>
                    </div>
                </div>

                {/* Game stats */}
                <div className='shrink-0 flex gap-2'>
                    {[
                        { label: "All games", value: candidate.games_all, color: "text-white", glow: "bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_70%)]" },
                        { label: "Playing", value: candidate.games_playing, color: "text-blue-400", glow: "bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_70%)]" },
                        { label: "Completed", value: candidate.games_completed, color: "text-green-400", glow: "bg-[radial-gradient(circle,rgba(34,197,94,0.3)_0%,rgba(0,0,0,0)_70%)]" },
                    ].map(box => (
                        <div key={box.label} className='relative flex-1 flex flex-col px-3 py-2 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/70'>
                            <div className={`absolute -top-8 -right-8 w-20 h-20 rounded-full ${box.glow}`} />
                            <p className='relative text-[11px] text-zinc-400'>{box.label}</p>
                            <p className={`relative mt-0.5 text-2xl font-bold leading-none ${box.color}`}>{formatNumber(box.value)}</p>
                        </div>
                    ))}
                </div>

                {/* Games in common */}
                <div className='shrink-0 flex flex-col p-3 rounded-2xl border border-green-500/30 bg-zinc-900/70'>
                    <p className='mb-2 text-xs font-semibold text-green-400'>
                        {candidate.common_games} {candidate.common_games === 1 ? 'game' : 'games'} in common
                    </p>
                    <div className='grid grid-cols-5 gap-1.5'>
                        {Array.from({ length: 5 }, (_, i) => {
                            const game = candidate.shared_games[i]
                            return game
                                ? <div key={i} title={game.game_name} className='relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-zinc-800'>
                                    {game.game_base_image &&
                                        <img src={game.game_base_image.replace("t_720p", "t_cover_big")} draggable={false} className='h-full w-full object-cover' alt={game.game_name} />}
                                    {game.favourite &&
                                        <span className='absolute top-0.5 right-1 text-[10px] text-yellow-400 drop-shadow'>★</span>}
                                </div>
                                : <div key={i} className='aspect-[3/4] rounded-lg border border-dashed border-white/15 bg-zinc-800/40' />
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className='shrink-0 flex items-center justify-between px-1'>
                    <img src="/logos/st2_white.png" draggable={false} className='h-4 w-auto object-contain' alt='Statrix' />
                    <p className='text-[11px] text-zinc-400'>
                        Play together on <span className='font-bold text-green-500'>statrix.app</span>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
