'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dialog, Toast } from 'radix-ui'
import { GameStatus } from '@/enums/GameStatus'
import AddToListModal from './AddToListModal'
import getUserVideogame from '@/actions/getUserVideogame'
import updateUserVideogame from '@/actions/updateUserVideogame'
import { GameIGDB } from '@/types/GameIGDB'
import { UserGame } from '@/types/UserGame'

type Props = {
    game: GameIGDB
    userName: string
    avatarImage: string
}

// Log of the logged user for the game page. Same features as AddGameModal, with a simpler design that matches the page
export default function AddGame({ game, userName, avatarImage }: Props) {
    const router = useRouter()
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>()
    const [starred, setStarred] = useState<boolean>(false)
    // Kept as the input text, so it can be empty while typing. It is converted to a number when saving
    const [hoursPlayed, setHoursPlayed] = useState<string>('')
    const [yearCompleted, setYearCompleted] = useState<string>('-')
    const [score, setScore] = useState<number>(0)
    const [showDropdownYear, setShowDropdownYear] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [openList, setOpenList] = useState<boolean>(false)

    // Toast shown after saving
    const timerRef = useRef(0)
    const [openToast, setOpenToast] = useState(false)

    const dropdownRef = useRef<HTMLDivElement>(null)

    const years: number[] = []
    for (let i = new Date().getFullYear(); i >= 1975; i--) {
        years.push(i)
    }

    // Load the saved data of the user for this game
    useEffect(() => {
        async function fetchUserGame() {
            const userGame: UserGame | undefined = await getUserVideogame(game.id)
            if (!userGame) return
            setScore(Number(userGame.score) || 0)
            setSelectedStatus(userGame.status)
            setStarred(userGame.favourite)
            // 0 hours shows the field empty (with the 0 placeholder), so the user can type directly
            setHoursPlayed(userGame.hours_played ? String(userGame.hours_played) : '')
            setYearCompleted(userGame.year_completed ?? '-')
        }
        fetchUserGame()
        return () => clearTimeout(timerRef.current)
    }, [game.id])

    // Close the years dropdown when clicking outside of it
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdownYear(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleHoursPlayedChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        // Empty is allowed (it is saved as 0). Negative or too big values are ignored
        if (value === '' || (Number(value) >= 0 && Number(value) <= 100000)) {
            setHoursPlayed(value)
        }
    }

    function handleStatusChange(status: GameStatus) {
        setSelectedStatus(status)
        // The year completed is hidden when the status is not completed, so its dropdown can't stay open
        if (status !== GameStatus.COMPLETED) setShowDropdownYear(false)
    }

    function handleYearCompletedChange(selectedYear: string) {
        setYearCompleted(selectedYear)
        setShowDropdownYear(false)
    }

    async function handleSaveUserGame() {
        setSaving(true)
        setError(null)

        const userGameUpdated: UserGame = {
            user_id: undefined, // The server action takes the user from the session
            game_id: game.id,
            game_name: game.name,
            game_image_id: game.cover.image_id,
            game_base_image: `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`,
            favourite: starred,
            score: Number(score),
            hours_played: hoursPlayed === '' ? 0 : parseFloat(hoursPlayed),
            status: selectedStatus,
            // Only completed games have a year completed. The state is kept, so it comes back if the user selects completed again
            year_completed: selectedStatus === GameStatus.COMPLETED ? yearCompleted : '-',
        }

        const response = await updateUserVideogame(userGameUpdated)
        setSaving(false)

        if (response?.success) {
            // Refresh the server data of the page (Statrix stats)
            router.refresh()
            setOpenToast(false)
            window.clearTimeout(timerRef.current)
            timerRef.current = window.setTimeout(() => { setOpenToast(true) }, 100)
        } else {
            setError(response?.message || 'There was an error saving the game info.')
        }
    }

    // Color of the score number
    const scoreText = score === 0 ? 'text-gray-500' : score >= 8 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : 'text-rose-400'

    // The selected status uses the same subtle style as the genre tags of the page
    const statusOptions = [
        { status: GameStatus.PLAYING, icon: '/staticImages/icon_controller.png', alt: 'Controller icon', iconClass: 'w-4', activeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/30' },
        { status: GameStatus.COMPLETED, icon: '/staticImages/icon_confirmation.png', alt: 'Confirmation icon', iconClass: 'w-3', activeClass: 'bg-green-500/10 text-green-400 border-green-500/30' },
        { status: GameStatus.ON_HOLD, icon: '/staticImages/icon_clock.png', alt: 'Clock icon', iconClass: 'w-4 h-4', activeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
        { status: GameStatus.DROPPED, icon: '/staticImages/icon_skull.png', alt: 'Skull icon', iconClass: 'w-4 h-4', activeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    ]

    return (
        <Toast.Provider>
            <section>
                {/* Header, like the other sections of the page */}
                <div className="flex items-end justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold">Your log</h2>
                    <Link href={`/profile/${userName}`} className="flex items-center gap-2 min-w-0 text-sm text-gray-400 transition hover:text-green-400">
                        <img src={avatarImage} className="w-5 h-5 rounded-full object-cover" alt="User avatar" />
                        <span className="truncate">{userName}</span>
                    </Link>
                </div>

                <div className="rounded-xl border border-white/10 bg-zinc-950">
                    {/* Score, hours played and year completed, separated like the Statrix stats */}
                    <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] border-b border-white/10">
                        {/* Score */}
                        <div className="col-span-2 md:col-span-1 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-white/10">
                            <p className="text-xs text-gray-500 uppercase">Score</p>
                            <div className="flex items-center gap-4 mt-1 group">
                                <span className={`w-8 shrink-0 text-xl font-bold transition-colors duration-300 ${scoreText}`}>{score === 0 ? 'NS' : score}</span>
                                {/* The label is centered over the slider, so it is inside the same container */}
                                <div className="relative flex flex-1 items-center h-8">
                                    {score === 0 && <p className="group-hover:hidden absolute inset-0 flex items-center justify-center text-xs text-gray-500 pointer-events-none">Drag to rate</p>}
                                    <input min="0" max="10" value={score} className="w-full rangeSlider" type="range" onChange={(e) => setScore(parseFloat(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        {/* Hours played */}
                        <div className="p-4 sm:p-5 border-r border-white/10">
                            <label htmlFor="hoursPlayed" className="text-xs text-gray-500 uppercase">Hours played</label>
                            <input type="number" id="hoursPlayed" onChange={handleHoursPlayedChange} min={0} inputMode="decimal" placeholder="0" value={hoursPlayed}
                                className="block w-full h-8 mt-1 bg-transparent text-xl font-bold outline-hidden placeholder:text-gray-600 border-b border-transparent transition focus:border-green-500" />
                        </div>

                        {/* Year completed, only editable when the game is completed */}
                        <div ref={dropdownRef} className="relative p-4 sm:p-5">
                            <p className="text-xs text-gray-500 uppercase">Year completed</p>
                            <button onClick={() => setShowDropdownYear(!showDropdownYear)} disabled={selectedStatus !== GameStatus.COMPLETED}
                                title={selectedStatus !== GameStatus.COMPLETED ? 'Mark the game as completed first' : undefined}
                                className="flex items-center justify-between gap-2 w-full h-8 mt-1 text-xl font-bold transition hover:text-green-400 disabled:text-gray-600 disabled:hover:text-gray-600 disabled:cursor-not-allowed">
                                <span className="truncate">{selectedStatus === GameStatus.COMPLETED ? yearCompleted : '-'}</span>
                                {selectedStatus === GameStatus.COMPLETED &&
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-gray-500 transition-transform ${showDropdownYear ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>}
                            </button>

                            {/* Dropdown of years */}
                            {showDropdownYear &&
                                <div className="absolute z-20 top-full left-2 right-2 -mt-2 max-h-44 p-1 overflow-y-auto no-scrollbar rounded-lg bg-zinc-900 border border-white/10 shadow-xl text-sm">
                                    <p className="cursor-pointer rounded-md px-3 py-1.5 transition hover:bg-white/10" onClick={() => handleYearCompletedChange("Don't remember")}>Don't remember</p>
                                    {years.map((year: number) => (
                                        <p key={year} onClick={() => handleYearCompletedChange(year.toString())}
                                            className={`cursor-pointer rounded-md px-3 py-1.5 transition hover:bg-white/10 ${yearCompleted === year.toString() ? 'bg-white/10 text-green-400' : ''}`}>{year}</p>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>

                    {/* Status, favourite and actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 sm:p-5">
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 text-sm">
                            {statusOptions.map((option) => (
                                <button key={option.status} onClick={() => handleStatusChange(option.status)}
                                    className={`flex items-center justify-center h-9 px-3 rounded-lg border transition ${selectedStatus === option.status ? option.activeClass : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                    <img src={option.icon} alt={option.alt} className={`${option.iconClass} mr-2 ${selectedStatus === option.status ? '' : 'opacity-60'}`} />
                                    {option.status}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 lg:ml-auto text-sm">
                            <button onClick={() => setStarred(!starred)} aria-label="Mark as favourite" aria-pressed={starred}
                                className={`flex items-center justify-center h-9 w-9 rounded-lg border transition ${starred ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            </button>
                            <button onClick={() => setOpenList(true)}
                                className="flex items-center justify-center h-9 px-3 rounded-lg border border-white/10 text-gray-300 transition hover:text-white hover:bg-white/5">
                                Add to list
                            </button>
                            <button onClick={handleSaveUserGame} disabled={saving}
                                className="flex items-center justify-center h-9 px-5 ml-auto lg:ml-0 rounded-lg font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300 disabled:opacity-60">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
                {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
            </section>

            {/* Add to list modal */}
            <Dialog.Root open={openList} onOpenChange={setOpenList}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
                    <Dialog.Content onCloseAutoFocus={(e) => { e.preventDefault() }}
                        className="fixed z-[101] w-full h-full sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-4/5 lg:w-3/5 2xl:w-3/7 rounded-lg shadow-xl
                        data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]">
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {/* Its back button closes the modal, as here there is no previous step */}
                        <AddToListModal game_id={game.id} game_name={game.name} game_base_image={game.cover.image_id} setNextSlide={() => setOpenList(false)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Toast.Root className="z-[101] fixed animate-slide-left flex flex-col bottom-15 right-5 sm:right-15 text-white rounded shadow-green-500/30 border-green-600 p-2 cardReviewGreen"
                open={openToast} onOpenChange={setOpenToast}>
                <Toast.Description>
                    <div className="flex items-center space-x-2">
                        <img src="/staticImages/icon_tick_circle.png" alt="Success icon" className="w-5 h-5" />
                        <p>Game info updated successfully</p>
                    </div>
                </Toast.Description>
                <Toast.Close />
            </Toast.Root>
            <Toast.Viewport />
        </Toast.Provider>
    )
}
