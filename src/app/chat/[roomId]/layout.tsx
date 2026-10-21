import getSessionUser from '@/actions/getSessionUser'
import getUserChatRooms from '@/actions/getUserChatRooms'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
    title: 'Chat - Statrix',
    description: 'Chat with your friends and stay connected'
}

export default async function ChatLayout({ children, params }: { children: React.ReactNode, params: { roomId: string } }) {

    const session: any = await getSessionUser()

    if (!session) {
        return (
            redirect("/")
        )
    }

    let existingFriendChatRoom: any = []
    existingFriendChatRoom = await getUserChatRooms()

    return (
        <section className='absolute h-screen w-full flex md:justify-center p-4 pt-28 text-white bg-zinc-950 overflow-hidden'>
            {/* Subtle background glows */}
            <div className='absolute inset-0 pointer-events-none' aria-hidden="true">
                <div className='absolute -top-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-green-600/10 blur-3xl' />
                <div className='absolute bottom-0 -right-40 w-[28rem] h-[28rem] rounded-full bg-lime-500/5 blur-3xl' />
            </div>

            <aside className="relative hidden sm:flex h-6/7 sm:w-2/5 md:w-2/5 lg:w-1/5 flex-col bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-s-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
                    <h2 className="text-xl font-bold">Recent chats</h2>
                    <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-xs bg-white/10 text-zinc-300">{existingFriendChatRoom.length}</span>
                </div>
                <div className="flex flex-col gap-1 p-2 overflow-y-auto no-scrollbar">
                    {existingFriendChatRoom.map((item: any, ident: number) => {
                        const isActive: boolean = String(item.room_id) === String(params.roomId)
                        return (
                            <Link href={`/chat/${item.room_id}`} key={ident}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition
                                ${isActive ? "bg-green-500/10 border-green-500/40" : "border-transparent hover:bg-white/5"}`}>
                                <div className={`shrink-0 w-10 h-10 rounded-full overflow-hidden ring-2 transition ${isActive ? "ring-green-500/60" : "ring-white/10 group-hover:ring-white/20"}`}>
                                    <img src={item.user_avatar ? `https://media.statrix.app/avatars/${item.user_id}/${item.user_avatar}` : "/avatarImages/avatar_default.jpg"} className="h-full w-full object-cover" alt='Avatar image' />
                                </div>
                                <p className={`text-sm sm:text-base font-medium truncate ${isActive ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>{item.user_name}</p>
                            </Link>
                        )
                    })}

                    {existingFriendChatRoom.length === 0 &&
                        <div className="flex flex-col items-center gap-2 text-center px-4 py-10 text-sm text-zinc-400">
                            <p>No chats yet.</p>
                            <Link href="/friends" className="text-green-400 hover:text-green-300 transition">Go to your friends</Link>
                        </div>
                    }
                </div>
            </aside>
            {children}
        </section>
    )
}
