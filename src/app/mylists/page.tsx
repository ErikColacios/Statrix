import React from 'react'
import Link from 'next/link';
import { getListsUser } from '@/actions/getListsUser'
import { List } from '@/types/List'
import getSessionUser from '@/actions/getSessionUser';
import ListsGrid from '@/components/ListsGrid';
import NoListCreated from '@/components/NoListCreated';

export default async function MyLists() {
    const session: any = await getSessionUser();
    const userId: string = session.user.id as string
    const userLists: List[] = await getListsUser(userId, false)

    if(userLists.length === 0) return (<NoListCreated />)

    const totalGames: number = userLists.reduce((total: number, list: any) => total + Number(list.covers[0]?.total_games ?? 0), 0)

    return (
        <>
            {/* Summary */}
            <div className="mb-5 flex items-center gap-4 border-b border-edge pb-4 text-smoke">
                <p><span className="font-semibold text-snow">{userLists.length}</span> {userLists.length === 1 ? "list" : "lists"}</p>
                <span className="h-1 w-1 rounded-full bg-edge" />
                <p><span className="font-semibold text-snow">{totalGames}</span> {totalGames === 1 ? "game" : "games"} in total</p>
            </div>

            <div className='md:grid grid-cols-2 gap-6'>
                <ListsGrid userLists={userLists} />

                {/* New list card */}
                <Link href="/newList"
                    className="group flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-edge bg-white/[0.02] p-6 text-center transition duration-300 hover:border-green-500/50 hover:bg-green-500/[0.04]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 text-2xl text-green-400 transition group-hover:scale-110">+</span>
                    <p className="font-semibold">Create a new list</p>
                    <p className="max-w-[26ch] text-sm text-smoke">A ranking, a collection, a backlog... whatever you need.</p>
                </Link>
            </div>
        </>
    )
}
