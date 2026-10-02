'use server'
import React from 'react'
import getGameInfoIGDB from '@/actions/getGameInfoIGDB'
import getGlobalUserVideogame from '@/actions/getGlobalUserVideogame'
import getGameReviews from '@/actions/getGameReviews'
import { ReviewMode } from '@/enums/ReviewMode'
import SliderImages from '@/components/SliderImages'
import ReviewSection from '@/components/ReviewSection'
import AddGame from '@/components/AddGame'
import getSessionUser from '@/actions/getSessionUser'

export default async function GamePage({ params }: { params: { list_id: string; game_id: number } }) {
    const session = await getSessionUser()
    const userId = session?.user.id as string | undefined

    const gameInfo = await getGameInfoIGDB(params.game_id)
    const globalStats = await getGlobalUserVideogame(params.game_id)
    const gameReviews = await getGameReviews(params.game_id, ReviewMode.POPULAR)

    const game = gameInfo[0]

    if (!game) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-400">Game not found.</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* Background artwork */}
                <div className="absolute inset-0">
                    {game.artworks?.[0] && (
                        <img
                            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.artworks[0].image_id}.jpg`}
                            alt="Artwork background"
                            className="w-full h-full object-cover opacity-50"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
                </div>

                {/* Hero content */}
                <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
                        {/* Cover */}
                        <div className="shrink-0">
                            <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.png`}
                                alt={`${game.name} cover`}
                                className="w-40 sm:w-48 md:w-56 rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Main information */}
                        <div className="flex-1 pb-2">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {game.genres?.map((genre: any) => (
                                    <span key={genre.id} className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400 border border-green-500/20">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{game.name}</h1>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm text-gray-300">
                                <span>
                                    <span className="text-gray-500">Released</span> {game.release_dates?.[0]?.human ?? 'Unknown'}
                                </span>
                                <span>
                                    <span className="text-gray-500">Platforms</span> {game.platforms?.length ?? 0}
                                </span>
                                <span>
                                    <span className="text-gray-500">Developers</span> {game.involved_companies?.length ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                {/* USER ACTIONS */}
                {/* {userId && (
                    <section className="relative -mt-2 mb-12 rounded-xl border border-white/10 bg-zinc-950/90 backdrop-blur p-4">
                        <AddGame game={game} />
                    </section>
                )} */}

                {/* About + Stats */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* About */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">About</h2>
                        <p className="text-gray-400 leading-7 max-w-3xl">{game.summary || 'No description available.'}</p>

                        {/* Extra information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-xs uppercase text-gray-500 mb-2">Developers</p>

                                <div className="flex flex-wrap gap-2">
                                    {game.involved_companies?.map((company: any) => (
                                        <span key={company.company.id} className="text-sm text-gray-300">
                                            {company.company.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-gray-500 mb-2">Platforms</p>
                                <div className="flex flex-wrap gap-2">
                                    {game.platforms?.map((platform: any) => (
                                        <span key={platform.id} className="text-sm text-gray-300">
                                            {platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATS */}
                    <aside>
                        <h2 className="text-xl font-semibold mb-4">Statrix stats</h2>

                        <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden">
                            {/* IGDB rating */}
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <span className="text-gray-400">IGDB rating</span>
                                <span className="text-4xl font-bold text-green-400">
                                    {game.rating ? Math.trunc(game.rating) : '-'}
                                </span>
                            </div>

                            {/* Statrix stats */}
                            <div className="grid grid-cols-2">
                                <div className="p-4 border-b border-r border-white/10 last:border-r-0">
                                    <p className="text-xs text-gray-500 uppercase">Playing</p>
                                    <p className="text-xl font-bold mt-1">{globalStats.globalPlaying ?? 0}</p>
                                </div>
                                <div className="p-4 border-b border-r border-white/10 last:border-r-0">
                                    <p className="text-xs text-gray-500 uppercase">Completed</p>
                                    <p className="text-xl font-bold mt-1">{globalStats.globalCompleted ?? 0}</p>
                                </div>
                                <div className="p-4 border-b border-r border-white/10 last:border-r-0">
                                    <p className="text-xs text-gray-500 uppercase">Dropped</p>
                                    <p className="text-xl font-bold mt-1">{globalStats.globalDropped ?? 0}</p>
                                </div>
                                <div className="p-4 border-b border-r border-white/10 last:border-r-0">
                                    <p className="text-xs text-gray-500 uppercase">Starred</p>
                                    <p className="text-xl font-bold mt-1">{globalStats.globalFavourite ?? 0}</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* SCREENSHOTS */}
                {game.screenshots?.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-xl font-semibold mb-5">Screenshots</h2>
                        <SliderImages screenshots={game.screenshots} />
                    </section>
                )}

                {/* REVIEWS */}
                <section className="mt-16 pt-10 border-t border-white/10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Reviews</h2>
                        <p className="text-sm text-gray-500 mt-1">Check what the community thinks about {game.name}.</p>
                    </div>
                    <ReviewSection
                        gameReviews={gameReviews}
                        gameId={params.game_id}
                        gameName={game.name}
                        coverImageId={game.cover.image_id}
                    />
                </section>
            </div>
        </main>
    )
}