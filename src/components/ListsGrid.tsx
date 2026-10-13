"use server"
import { ListMode } from "@/enums/ListMode"
import { List } from "@/types/List"
import Link from "next/link"
import React from "react"

type Props = {
    userLists: List[]
}

export default async function ListsGrid({ userLists }: Props) {
    return (
        <>
            {userLists.map((list: any, index: number) => (
                <Link href={`/list/${list.list_id}`} key={index} className='flex flex-col bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 rounded-2xl overflow-hidden mb-4 md:mb-0'>
                    <div className='relative flex w-full h-48 bg-black'>
                        {list.covers.map((cover: any, i: number) => (
                            <img key={i} src={cover.game_base_image} className='absolute w-36 h-48 rounded-tr-xl border border-gray-600'
                                style={{
                                    left: `${i * 20}%`, zIndex: list.covers.length * 10 - (i * 10),
                                }}
                                alt='Cover image' />
                        ))}
                    </div>

                    <div className='flex items-center p-6'>
                        <div className='flex flex-col w-full '>
                            <p className="text-2xl text-gray-200">{list.list_name}</p>
                            <div className="flex items-center text-sm text-gray-400 pt-2">
                                <p>Games: {list.covers[0]?.total_games}</p>
                                
                                <span className={`${list.list_mode === ListMode.UNRANKED ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"} ml-4 px-2 py-1 mt-1 text-xs rounded`}>
                                    {list.list_mode}
                                </span>
                                <p className="ml-auto ">Created: {list.list_creationdate.toISOString().split('T')[0]}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))
            }
        </>
    )
}