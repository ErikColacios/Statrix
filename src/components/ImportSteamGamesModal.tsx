'use client'
import React from 'react';
import { Dialog } from 'radix-ui';
import insertSteamGames from '@/actions/insertSteamGames';

export default function ImportSteamGamesModal({ importedGames, setImportedGames, notFoundGames, setNotFoundGames, selectedGames, gamesCount, setGamesCount, stopImportingRef }: { importedGames: number, setImportedGames: any, notFoundGames: string[], setNotFoundGames: any, selectedGames: any[], gamesCount: number, setGamesCount: any, stopImportingRef: React.MutableRefObject<boolean> }) {

    async function handleRetryImportGames() {
        setImportedGames(0)
        setNotFoundGames([])
        setGamesCount(0)
        stopImportingRef.current = false
        let gamesCount: number = 1
        let importedGamesCount: number = 0

        for (const game of selectedGames) {
            if (stopImportingRef.current) {
                console.log("Steam import cancelled")
                break;
            }
            const res = await insertSteamGames(game)
            if (res?.success === false) {
                setNotFoundGames((prev: any) => [...prev, game.name])
            } else {
                importedGamesCount++
                setImportedGames(importedGamesCount)
            }
            setGamesCount(gamesCount++)
        }
    }

    const isFinished: boolean = gamesCount === selectedGames.length
    const percentage: number = selectedGames.length > 0 ? Math.round((gamesCount / selectedGames.length) * 100) : 0
    const hasErrors: boolean = notFoundGames.length > 0

    return (
        <div className={`relative w-full h-full sm:h-auto flex flex-col justify-center sm:border sm:rounded-2xl bg-zinc-950 text-white shadow-2xl ${isFinished && hasErrors ? "border-yellow-500/30" : "border-white/15"}`}>

            {/* Glow backdrop */}
            <div className="absolute inset-0 overflow-hidden sm:rounded-2xl pointer-events-none" aria-hidden="true">
                <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${isFinished && hasErrors ? "bg-yellow-600/10" : "bg-green-600/15"}`} />
            </div>

            <div className="relative flex flex-col gap-6 px-4 py-8 md:p-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                        <img src="/staticImages/icon_steam.png" alt="Steam" className="w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                            {!isFinished ? "Importing games..." : hasErrors ? "Imported with errors" : "Import completed"}
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {!isFinished
                                ? "Please wait. This may take a few minutes, depending on the amount of games."
                                : `${gamesCount} of ${selectedGames.length} games processed.`}
                        </p>
                    </div>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex items-baseline justify-between text-sm">
                        <p className="text-zinc-400">{gamesCount} / {selectedGames.length}</p>
                        <p className="font-semibold text-green-400">{percentage}%</p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full bg-linear-to-r transition-all duration-500 ${isFinished && hasErrors ? "from-yellow-500 to-lime-500" : "from-green-500 to-lime-400"} ${!isFinished ? "animate-pulse" : ""}`}
                            style={{ width: `${percentage}%` }} />
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-green-500/25 bg-green-500/[0.06] p-4">
                        <p className="text-3xl font-bold text-green-400">{importedGames}</p>
                        <p className="text-sm text-zinc-400">Imported</p>
                    </div>
                    <div className={`rounded-xl border p-4 ${hasErrors ? "border-rose-500/25 bg-rose-500/[0.06]" : "border-white/10 bg-white/[0.03]"}`}>
                        <p className={`text-3xl font-bold ${hasErrors ? "text-rose-400" : "text-zinc-300"}`}>{notFoundGames.length}</p>
                        <p className="text-sm text-zinc-400">Not found in IGDB</p>
                    </div>
                </div>

                {isFinished && hasErrors && (
                    <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm font-medium text-zinc-300">These games couldn&apos;t be matched with IGDB:</p>
                        <ul className="mt-2 max-h-48 overflow-y-auto no-scrollbar text-sm text-rose-400 space-y-1">
                            {notFoundGames.map((game, index) => (
                                <li key={index} className="truncate">{game}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 sm:ml-auto">
                    {hasErrors && isFinished && (
                        <button onClick={handleRetryImportGames} className="flex-1 sm:flex-none flex items-center justify-center h-11 px-6 rounded-xl font-medium bg-white/5 border border-white/15 cursor-pointer transition hover:bg-white/10">
                            Import again
                        </button>
                    )}
                    <Dialog.Close onClick={() => stopImportingRef.current = true}
                        className={`flex-1 sm:flex-none flex items-center justify-center h-11 px-6 rounded-xl font-semibold cursor-pointer transition
                        ${isFinished ? "bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40" : "bg-white/5 border border-white/15 font-medium hover:bg-white/10"}`}>
                        {isFinished ? "Done" : "Cancel"}
                    </Dialog.Close>
                </div>
            </div>
        </div>
    )
}
