import getSessionUser from '@/actions/getSessionUser'
import getUserChatRooms from '@/actions/getUserChatRooms'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {

    const session:any = await getSessionUser()

    if (!session) {
        return (
            redirect("/")
        )
    }

    let existingFriendChatRoom: any = []
    existingFriendChatRoom = await getUserChatRooms()

    return (
        <section className='h-screen w-full flex md:justify-center p-4 pt-14 text-white bg-linear-to-b from-black via-gray-900 to-black'>
            <aside className="h-140 sm:h-160 2xl:h-180 hidden sm:flex sm:w-2/5 md:w-2/5 lg:w-1/5 flex-col bg-zinc-900 border border-gray-600 rounded-s-2xl">
                <h2 className="text-2xl font-bold p-6">Recent chats</h2>
                {existingFriendChatRoom.map((item: any, ident: number) => (
                    <div className="mx-4 py-2 mb-2 rounded-sm bg-zinc-800 hover:bg-zinc-700" key={ident}>
                        <Link href={`/chat/${item.room_id}`} className="flex items-center">
                            <div className="ml-2 w-8 h-8 rounded-sm rounded-full overflow-hidden">
                                <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" alt='Avatar image'/>
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