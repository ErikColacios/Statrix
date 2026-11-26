"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from 'radix-ui'
import getMatchCandidates from '@/actions/getMatchCandidates'
import insertSwipe from '@/actions/insertSwipe'
import updateMatchmakingEnabled from '@/actions/updateMatchmakingEnabled'
import getSessionUserInfo from '@/actions/getSessionUserInfo'
import MatchCard from '@/components/MatchCard'
import { MatchCandidate } from '@/types/MatchCandidate'

export default function Match() {
    const router = useRouter()
    const [candidates, setCandidates] = useState<MatchCandidate[]>([])
    const [index, setIndex] = useState<number>(0)
    const [enabled, setEnabled] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [forcedSwipe, setForcedSwipe] = useState<'left' | 'right' | null>(null)
    const [match, setMatch] = useState<{ candidate: MatchCandidate, roomId: string } | null>(null)
    const [myAvatarUrl, setMyAvatarUrl] = useState<string>("/avatarImages/avatar_default.jpg")

    // Swipes not saved yet, and users already swiped in this visit (so they don't appear again)
    const pendingSwipes = useRef<Promise<void>[]>([])
    const swipedIds = useRef<Set<string>>(new Set())

    async function loadCandidates() {
        setIsLoading(true)
        await Promise.all(pendingSwipes.current)
        pendingSwipes.current = []

        const response = await getMatchCandidates()
        setEnabled(response.enabled)
        setCandidates(response.candidates.filter(c => !swipedIds.current.has(String(c.user_id))))
        setIndex(0)
        setIsLoading(false)
    }

    async function enableMatchmaking() {
        setIsLoading(true)
        const response = await updateMatchmakingEnabled(true)
        if (response.success) {
            await loadCandidates()
        } else {
            setIsLoading(false)
        }
    }

    // Called by the top card when its swipe animation ends
    function handleSwipe(liked: boolean) {
        const candidate = candidates[index]
        if (!candidate) return

        setForcedSwipe(null)
        swipedIds.current.add(String(candidate.user_id))
        setIndex(i => i + 1)

        const promise = insertSwipe(candidate.user_id, liked).then(response => {
            if (response.match && response.roomId) {
                setMatch({ candidate, roomId: response.roomId })
            }
        })
        pendingSwipes.current.push(promise)
    }

    function requestSwipe(direction: 'left' | 'right') {
        if (forcedSwipe || match || !candidates[index]) return
        setForcedSwipe(direction)
    }

    useEffect(() => {
        loadCandidates()
        const loadMyAvatar = async () => {
            const userInfo = await getSessionUserInfo()
            if (userInfo[0]?.user_avatar) {
                setMyAvatarUrl(`https://media.statrix.app/avatars/${userInfo[0].user_id}/${userInfo[0].user_avatar}`)
            }
        }
        loadMyAvatar()
    }, [])

    // When all the cards are swiped, we look for more players
    useEffect(() => {
        if (!isLoading && candidates.length > 0 && index >= candidates.length) {
            loadCandidates()
        }
    }, [index])

    // Keyboard: left arrow = pass, right arrow = like
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') requestSwipe('left')
            if (e.key === 'ArrowRight') requestSwipe('right')
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [forcedSwipe, match, candidates, index])

    // The top card and the next one, the top card is rendered last so it's above
    const visibleCards = candidates.slice(index, index + 2).reverse()
    const hasCards = visibleCards.length > 0

    return (
        <div className='w-full max-w-sm flex flex-col items-center'>
            {/* Header */}
            <div className='w-full text-center'>
                <h2 className='text-3xl md:text-4xl font-bold'>Match</h2>
                <p className='text-sm text-zinc-400 mt-1'>Find players with the same taste in games as you.</p>
            </div>

            {isLoading ?
                <div className='mt-8 w-full h-[32rem] rounded-3xl border border-white/10 bg-white/5 animate-pulse' />
                : !enabled ?
                    // Matchmaking disabled
                    <div className='mt-8 w-full flex flex-col items-center justify-center gap-4 text-center h-[32rem] px-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.03]'>
                        <p className='text-4xl'>🎮</p>
                        <p className='text-lg font-semibold'>Matchmaking is disabled</p>
                        <p className='text-sm text-zinc-400'>Enable it to see other players and to appear to them. You can disable it at any time in Settings.</p>
                        <button onClick={enableMatchmaking}
                            className='mt-2 flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300'>
                            Enable matchmaking
                        </button>
                    </div>
                    : !hasCards ?
                        // No more candidates
                        <div className='mt-8 w-full flex flex-col items-center justify-center gap-2 text-center h-[32rem] px-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] text-zinc-400'>
                            <p className='text-2xl text-zinc-300'>(－_－) zzZ</p>
                            <p>No more players by now</p>
                            <p className='text-sm'>Add more games to your library to find more players.</p>
                            <button onClick={loadCandidates}
                                className='mt-4 flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-300 transition hover:text-white hover:bg-white/10'>
                                Search again
                            </button>
                        </div>
                        :
                        <>
                            {/* Cards */}
                            <div className='relative mt-8 w-full h-[32rem]'>
                                {visibleCards.map(candidate => (
                                    <MatchCard key={candidate.user_id} candidate={candidate}
                                        isTop={candidate.user_id === candidates[index].user_id}
                                        forcedSwipe={forcedSwipe} onSwipe={handleSwipe} />
                                ))}
                            </div>

                            {/* Pass / like buttons */}
                            <div className='mt-8 flex items-center gap-6'>
                                <button onClick={() => requestSwipe('left')} title='Pass (←)' aria-label='Pass'
                                    className='flex items-center justify-center w-16 h-16 rounded-full border border-white/10 bg-white/5 text-rose-500 shadow-lg transition hover:scale-110 hover:bg-rose-600/20 hover:border-rose-500/40'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                                <button onClick={() => requestSwipe('right')} title='Like (→)' aria-label='Like'
                                    className='flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-green-500 to-lime-500 shadow-lg shadow-green-900/40 transition hover:scale-110'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                </button>
                            </div>
                            <p className='mt-3 hidden sm:block text-xs text-zinc-500'>Drag the card or use the ← → keys</p>
                        </>
            }

            {/* Match modal */}
            <Dialog.Root open={match !== null} onOpenChange={(open) => { if (!open) setMatch(null) }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
                    <Dialog.Content className='fixed z-50 w-[90%] max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 p-8 rounded-3xl border border-green-500/30 bg-zinc-900 text-white text-center shadow-2xl shadow-green-900/40
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]'>
                        <Dialog.Title className='text-4xl font-black bg-linear-to-r from-green-400 to-lime-400 bg-clip-text text-transparent'>
                            It&apos;s a match!
                        </Dialog.Title>
                        <Dialog.Description className='text-sm text-zinc-400'>
                            You and {match?.candidate.user_name} liked each other. You are now friends.
                        </Dialog.Description>

                        <div className='my-2 flex items-center'>
                            <div className='w-24 h-24 rounded-full overflow-hidden ring-4 ring-green-500 -rotate-6'>
                                <img src={myAvatarUrl} className='h-full w-full object-cover' alt='Your avatar' />
                            </div>
                            <div className='-ml-4 w-24 h-24 rounded-full overflow-hidden ring-4 ring-lime-400 rotate-6'>
                                <img src={match?.candidate.user_avatar ? `https://media.statrix.app/avatars/${match.candidate.user_id}/${match.candidate.user_avatar}` : "/avatarImages/avatar_default.jpg"}
                                    className='h-full w-full object-cover' alt={`Avatar of ${match?.candidate.user_name}`} />
                            </div>
                        </div>

                        <button onClick={() => match && router.push(`/chat/${match.roomId}`)}
                            className='w-full flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            Send message
                        </button>
                        <Dialog.Close className='w-full h-11 px-5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-300 transition hover:text-white hover:bg-white/10'>
                            Keep swiping
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
