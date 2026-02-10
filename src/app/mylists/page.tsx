import React from 'react'
import Link from "next/link"
import { getListsUser } from '@/actions/getListsUser'
import { List } from '@/types/List'

export default async function MyLists() {
    const userLists: List[] = await getListsUser()

    return (
        <div className='md:grid grid-cols-2 gap-6'>
            {userLists.map((list: any, index: number) => (
                // List - Shows top 5 games with Its cover
                <Link href={`list/${list.list_id}`} key={index} className='flex flex-col bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 rounded-2xl overflow-hidden mb-4 md:mb-0'>
                    <div className='relative flex w-full h-48 bg-black'>
                        {list.covers.map((cover: any, i: number) => (
                            <img key={i} src={cover.game_base_image} className='absolute w-36 h-48 rounded-tr-xl border border-gray-600'
                                style={{
                                    left: `${i * 20}%`, zIndex: list.covers.length * 10 - (i * 10),
                                }} 
                                alt='Cover image'/>
                        ))}
                    </div>

                    <div className='flex items-center p-6'>
                        <div className='flex flex-col'>
                            <p className="text-2xl text-gray-200">{list.list_name}</p>
                            <p className="text-sm text-gray-400 pt-1">Games: {list.covers[0].total_games}</p>
                        </div>
                        <p className="ml-auto text-sm text-gray-400">Created: {list.list_creationdate.toISOString().split('T')[0]}</p>
                    </div>
                </Link>
            ))
            }
        </div>
    )
}