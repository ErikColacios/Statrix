"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { useRouter } from 'next/navigation'
import { FriendshipStatus } from '@/enums/FriendshipStatus'
import updateUserFriendship from '@/actions/updateUserFriendship'
import getCreateChat from '@/actions/getCreateChat'
import getSessionUser from '@/actions/getSessionUser'
import PrimaryButton from '@/components/PrimaryButton'
import AddNewFriendModal from '@/components/AddNewFriendModal'
import getUsersFriendship from '@/actions/getUsersFriendship'

export default function Friends() {

    const router = useRouter()
    const [user, setUser] = useState<User>()
    const [usersFound, setUsersFound] = useState([])
    const [userSearchMode, setUserSearchMode] = useState<FriendshipStatus>(FriendshipStatus.ACCEPTED)

    async function loadFriendships(userSearchMode: FriendshipStatus) {
        let friendships: any = []
        setUserSearchMode(userSearchMode)
        friendships = await getUsersFriendship(userSearchMode)
        setUsersFound(friendships.all)
    }

    async function acceptFriendRequest(requester_id: string) {
        if (requester_id !== null && user !== null)
            try {
                await updateUserFriendship(requester_id, user?.user_id, FriendshipStatus.ACCEPTED)
            } catch (error) {
                console.log(error)
            }
    }


    async function openChat(user2_id: string, user2_name: string) {
        let chat: any = []
        chat = await getCreateChat(user2_id, user2_name)
        if (chat.length > 0) {
            router.push(`/chat/${chat[0].room_id}`)
        }
    }

    useEffect(() => {
        loadFriendships(userSearchMode)
        const getSessionUserId = async () => {
            const user = await getSessionUser()
            setUser(user)
        }
        getSessionUserId()
    }, [])


    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4'>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className={`fixed w-full p-2 md:w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                            data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        <AddNewFriendModal />
                    </Dialog.Content>
                </Dialog.Portal>
                <div className='w-full flex items-center border-b-2 border-gray-500 pb-3'>
                    <h2 className='text-2xl'>Friends</h2>
                    <Dialog.Trigger asChild className='ml-auto'>
                        <div>
                            <PrimaryButton text="Add a friend" />
                        </div>
                    </Dialog.Trigger>
                </div>
                <div className='relative flex flex-col'>
                    <div className="flex text-base">
                        <button className={`pl-4 pt-1 pr-4 pb-1 hover:bg-gray-700 ${userSearchMode === FriendshipStatus.ACCEPTED ? 'bg-gray-600' : 'bg-transparent'}`}
                            onClick={() => loadFriendships(FriendshipStatus.ACCEPTED)}>Accepted</button>
                        <button className={`pl-4 pt-1 pr-4 pb-1 hover:bg-gray-700 ${userSearchMode === FriendshipStatus.PENDING ? 'bg-gray-600' : 'bg-transparent'}`}
                            onClick={() => loadFriendships(FriendshipStatus.PENDING)}>Pending</button>
                        <button className={`pl-4 pt-1 pr-4 pb-1 hover:bg-gray-700 ${userSearchMode === FriendshipStatus.BLOCKED ? 'bg-gray-600' : 'bg-transparent'}`}
                            onClick={() => loadFriendships(FriendshipStatus.BLOCKED)}>Blocked</button>
                    </div>
                </div>

                <div className='mt-5 overflow-scroll no-scrollbar'>
                    {/* Users found */}
                    {usersFound.map((item: any, index: number) => (
                        <div key={index} className='relative flex items-center p-2 mb-4 h-18 space-x-4 border border-gray-600 bg-zinc-900 rounded-lg'>
                            <Link href={`/profile/${item.user_name}`} className='flex items-center'>
                                <div className="w-10 h-10 rounded rounded-full overflow-hidden">
                                    <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" />
                                </div>
                                {/* User name */}
                                <p className='ml-4 text-lg hover:text-green-400'>{item.user_name}</p>
                            </Link>

                            <div className='flex items-center text-base text-gray-400'>
                                {/* <p className='text-sm'>Joined: {item.user_creationdate.toISOString().split('T')[0]}</p> */}
                            </div>

                            {/* Friend row buttons */}
                            <div className='absolute right-5'>
                                {userSearchMode === FriendshipStatus.PENDING ? user?.user_id === item.requester_id ?
                                    <p>Pending</p> :
                                    <button onClick={() => acceptFriendRequest(item.requester_id)}
                                        className='w-28 text-sm p-1 rounded border border-green-500 hover:bg-green-500 hover:text-black'>Accept</button>
                                    : ''}

                                {userSearchMode === FriendshipStatus.ACCEPTED ?
                                    <button className='text-sm p-1 rounded border border-green-500 hover:bg-green-500'
                                        onClick={() => openChat(item.user_id, item.user_name)}>
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 8H16M8 12H13M7 16V21L12 16H20V4H4V16H7Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    </button>
                                    : ''}
                            </div>

                        </div>
                    ))}
                    {usersFound.length === 0 &&
                        <div className='flex flex-col items-center justify-center text-center mb-4 h-64 text-gray-400 border border-gray-600 bg-gray-800/50 rounded-lg'>
                            <p>(－_－) zzZ</p>
                            <p>Nothing to check here by now</p>
                        </div>}
                </div>
            </Dialog.Root>
        </div>
    )
}