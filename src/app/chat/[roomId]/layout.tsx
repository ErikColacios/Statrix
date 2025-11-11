import { getSession } from '@/actions/getSession'
import getUserChatRooms from '@/actions/getUserChatRooms'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {

    const session = await getSession()

    if (!session.isLoggedIn) {
        return (
            redirect("/")
        )
    }

    let existingFriendChatRoom: any = []
    existingFriendChatRoom = await getUserChatRooms()

    return (
        <section className='w-full flex md:justify-center p-4 pt-20 md:pt-20 text-white bg-gradient-to-b from-black via-gray-900 to-black'>
            <aside className="hidden sm:flex sm:w-2/5 md:w-1/5 flex-col bg-zinc-900 p-2 md:p-4 border border-gray-600 rounded-s-2xl">
                <h2 className="text-2xl font-bold pl-2 mb-8">Recent</h2>
                {existingFriendChatRoom.map((item: any, ident: number) => (
                    <div className="p-2 mb-2 bg-zinc-800 hover:bg-zinc-700 rounded" key={ident}>
                        <Link href={`/chat/${item.room_id}`} className="flex items-center">
                            <div className="w-8 h-8 rounded rounded-full overflow-hidden">
                                <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" />
                            </div>
                            <p className="text-sm sm:text-base text-white ml-3">{item.user_name}</p>
                        </Link>
                    </div>
                ))}
            </aside>
            {children}
        </section>
    )
}