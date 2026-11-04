import React from 'react'
import { ListMode } from '@/enums/ListMode'

type Props = {
    listName: string,
    setListName: (name: string) => void,
    listDescription: string,
    setListDescription: (description: string) => void,
    isFeatured: boolean,
    setIsFeatured: (featured: boolean) => void,
    visibility: string,
    setVisibility: (visibility: string) => void,
    mode: ListMode,
    setMode: (mode: ListMode) => void,
    nameError?: string | null
}

const DESCRIPTION_MAX_LENGTH = 250

const visibilityOptions = [
    { value: "public", icon: "/staticImages/icon_world.png", alt: "Public icon", title: "Public", description: "Visible for anyone" },
    { value: "friends-only", icon: "/staticImages/icon_friends.png", alt: "Friends icon", title: "Friends only", description: "Only your friends can see it" },
    { value: "private", icon: "/staticImages/icon_locked.png", alt: "Private icon", title: "Private", description: "Only you can access this list" },
]

const modeOptions = [
    { value: ListMode.UNRANKED, icon: "/staticImages/icon_unordered-list.png", alt: "List icon", title: "Unranked", description: "Unordered list" },
    { value: ListMode.RANKED, icon: "/staticImages/icon_cup.png", alt: "Cup icon", title: "Ranked", description: "Ordered from first to last" },
]

// Name, description, featured, visibility and mode of a list. Used when creating a list and in the edit list modal
export default function ListInfoFields({ listName, setListName, listDescription, setListDescription, isFeatured, setIsFeatured,
    visibility, setVisibility, mode, setMode, nameError }: Props) {

    return (
        <div className="flex flex-col gap-6 text-sm">
            {/* Name */}
            <div className="flex flex-col gap-2">
                <label htmlFor="listName" className="text-xs font-medium uppercase tracking-wider text-zinc-400">List name *</label>
                <input type="text" id="listName" value={listName} onChange={(e) => setListName(e.target.value)}
                    placeholder="My all time favourites"
                    className={`h-11 w-full rounded-lg px-3 bg-white/5 border outline-hidden placeholder:text-zinc-500 transition focus:bg-white/10 ${nameError ? "border-rose-500" : "border-white/10 focus:border-green-500"}`} />
                {nameError && <p className="text-xs text-rose-400">{nameError}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center">
                    <label htmlFor="listDescription" className="text-xs font-medium uppercase tracking-wider text-zinc-400">Description</label>
                    <span className="ml-auto text-xs text-zinc-500">{listDescription.length}/{DESCRIPTION_MAX_LENGTH}</span>
                </div>
                <textarea id="listDescription" rows={4} maxLength={DESCRIPTION_MAX_LENGTH} value={listDescription}
                    onChange={(e) => setListDescription(e.target.value)}
                    placeholder="What is this list about?"
                    className="w-full rounded-lg p-3 bg-white/5 border border-white/10 outline-hidden resize-none placeholder:text-zinc-500 transition focus:border-green-500 focus:bg-white/10" />
            </div>

            {/* Featured */}
            <button type="button" role="switch" aria-checked={isFeatured} onClick={() => setIsFeatured(!isFeatured)}
                className="flex items-center gap-3 w-full rounded-xl p-3 text-left border border-white/10 bg-white/5 transition hover:bg-white/10">
                <div className="flex flex-col">
                    <span className="font-medium">Featured list</span>
                    <span className="text-xs text-zinc-400">Featured lists are shown on your profile</span>
                </div>
                <span className={`relative ml-auto shrink-0 w-10 h-6 rounded-full transition-colors ${isFeatured ? "bg-green-500" : "bg-zinc-700"}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isFeatured ? "translate-x-4" : ""}`} />
                </span>
            </button>

            {/* Visibility */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Visibility</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {visibilityOptions.map((option) => (
                        <button key={option.value} type="button" aria-pressed={visibility === option.value} onClick={() => setVisibility(option.value)}
                            className={`flex sm:flex-col items-center gap-3 sm:gap-1 rounded-xl p-3 sm:p-4 text-left sm:text-center border transition
                            ${visibility === option.value ? "bg-green-500/15 border-green-500" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`}>
                            <img src={option.icon} alt={option.alt} className="w-5 shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-semibold">{option.title}</span>
                                <span className="text-xs text-zinc-400">{option.description}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mode */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Mode</p>
                <div className="grid grid-cols-2 gap-2">
                    {modeOptions.map((option) => (
                        <button key={option.value} type="button" aria-pressed={mode === option.value} onClick={() => setMode(option.value)}
                            className={`flex sm:flex-col items-center gap-3 sm:gap-1 rounded-xl p-3 sm:p-4 text-left sm:text-center border transition
                            ${mode === option.value ? "bg-green-500/15 border-green-500" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}`}>
                            <img src={option.icon} alt={option.alt} className="w-5 shrink-0" />
                            <div className="flex flex-col">
                                <span className="font-semibold">{option.title}</span>
                                <span className="text-xs text-zinc-400">{option.description}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
