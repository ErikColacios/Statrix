'use client'
import React from 'react';
import { Dialog } from 'radix-ui';
import LoadingAnimation from './LoadingAnimation';
import insertSteamGames from '@/actions/insertSteamGames';

export default function ImportSteamGamesModal({ importedGames, setImportedGames, notFoundGames, setNotFoundGames, selectedGames, gamesCount, setGamesCount, stopImportingRef }: { importedGames: number, setImportedGames: any, notFoundGames: string[], setNotFoundGames: any, selectedGames: any[], gamesCount: number, setGamesCount: any, stopImportingRef: React.MutableRefObject<boolean> }) {

    async function handleRetryImportGames() {
        setImportedGames(0)
        setNotFoundGames([])
        setGamesCount(0)
        stopImportingRef.current = false
        let gamesCount: number = 1
        let importedGamesCount: number = importedGames

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

    return (
        <div className="w-full h-full flex flex-col justify-center sm:border sm:border-gray-600 px-4 py-8 md:px-10 text-white sm:rounded-2xl bg-black/60 backdrop-blur-lg">
            {gamesCount !== selectedGames.length && (
                <div className='flex flex-col'>
                    <h3 className="text-3xl font-bold mb-4">Importing ...</h3>
                    <p className="text-gray-400 mb-4">Please wait. This may take a few minutes, depending on the amount of games to be imported.</p>
                    <p>{gamesCount} / {selectedGames.length}</p>
                    <LoadingAnimation />
                </div>
            )}

            {notFoundGames.length > 0 && gamesCount === selectedGames.length && (
                <h3 className="text-3xl font-bold">Imported with errors</h3>
            )}

            <div className="flex flex-col w-full mt-4">
                {gamesCount === selectedGames.length && importedGames > 0 && (
                    <div className="cardReviewGreen rounded-xl p-3 my-4">
                        <p className="text-green-400">{importedGames} games imported successfully.</p>
                    </div>
                )}
                {gamesCount === selectedGames.length && notFoundGames.length > 0 && (
                    <div className="cardReviewRed rounded-xl flex flex-col mt-4 p-3 overflow-scroll no-scrollbar max-h-96 mb-4">
                        <p>Unable to import {notFoundGames.length} games</p>
                        <ul className="text-red-500 text-sm mt-2">
                            {notFoundGames.map((game, index) => (
                                <li key={index}>{game}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className='flex space-x-2 ml-auto'>
                {notFoundGames.length > 0 && gamesCount === selectedGames.length && (
                    <button onClick={handleRetryImportGames} className="rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">
                        <p>Import again</p>
                    </button>
                )}
                <Dialog.Close onClick={() => stopImportingRef.current = true} className="rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">
                    <p>Cancel</p>
                </Dialog.Close>
            </div>
        </div>
    )
}