'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import LoadingAnimation from './LoadingAnimation';
import insertSteamGames from '@/actions/insertSteamGames';

export default function ImportSteamGamesModal({ importedGames, setImportedGames, notFoundGames, setNotFoundGames, steamGames }: { importedGames: number, setImportedGames: any, notFoundGames: string[], setNotFoundGames: any, steamGames: any[] }) {

    async function handleRetryImportGames() {
        setImportedGames(0)
        setNotFoundGames([])
        const res = await insertSteamGames(steamGames)
        //console.log(res)

        if (res?.success === false) {
            setNotFoundGames(res?.notFoundGames || [])
        }
        setImportedGames(res?.importedGames || 0)
    }

    return (
        <div className="w-full h-full flex flex-col justify-center sm:border sm:border-gray-600 px-4 py-8 md:px-10 text-white sm:rounded-2xl bg-black/60 backdrop-blur-lg">
            {importedGames === 0 && (
                <div className='flex flex-col'>
                    <h3 className="text-3xl font-bold mb-4">Importing ...</h3>
                    <p className="text-gray-400 mb-8">Please wait. This may take a few minutes, depending on the amount of games to be imported.</p>
                    <LoadingAnimation />
                </div>
            )}
            {notFoundGames.length > 0 && (
                <h3 className="text-3xl font-bold">Imported with errors</h3>
            )}

            <div className="flex flex-col w-full mt-4">
                {importedGames !== 0 && (
                    <div className="cardReviewGreen rounded-xl p-3 mb-4">
                        <p className="text-green-400">{importedGames} games imported successfully.</p>
                    </div>
                )}
                {notFoundGames.length > 0 && (
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
                {notFoundGames.length > 0 && (
                    <button onClick={handleRetryImportGames} className="rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">
                        <p>Import again</p>
                    </button>
                )}
                <Dialog.Close className="rounded-sm text-gray-400 border border-gray-400 px-2 py-1 transition hover:text-white hover:bg-zinc-800">
                    <p>Cancel</p>
                </Dialog.Close>
            </div>
        </div>
    )
}