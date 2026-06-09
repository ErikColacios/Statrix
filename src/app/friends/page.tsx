"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { useRouter } from 'next/navigation'
import { FriendshipStatus } from '@/enums/FriendshipStatus'
import updateUserFriendship from '@/actions/updateUserFriendship'
import getCreateChat from '@/actions/getCreateChat'
import getSessionUser from '@/actions/getSessionUser'
import AddNewFriendModal from '@/components/AddNewFriendModal'
import getUsersFriendship from '@/actions/getUsersFriendship'
import SkeletonFriends from './skeleton'
import { deleteUserFriendship } from '@/actions/deleteUserFriendship'
import DeleteFriendModal from '@/components/DeleteFriendModal'

export default function Friends() {

    const router = useRouter()
    const [user, setUser] = useState<User>()
    const [usersFound, setUsersFound] = useState([])
    const [userSearchMode, setUserSearchMode] = useState<FriendshipStatus>(FriendshipStatus.ACCEPTED)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [modalType, setModalType] = useState<string | null>(null)
    const [friendClicked, setFriendClicked] = useState([])

    async function loadFriendships(userSearchMode: FriendshipStatus) {
        let friendships: any = []
        setUserSearchMode(userSearchMode)
        friendships = await getUsersFriendship(userSearchMode)
        setUsersFound(friendships.all)
        setIsLoading(false)
    }

    async function acceptFriendRequest(requester_id: string) {
        if (requester_id !== null && user !== null)
            try {
                await updateUserFriendship(requester_id, user?.userId, FriendshipStatus.ACCEPTED)
            } catch (error) {
                console.log(error)
            }
    }

    async function removeFriendRequest(addressee_id: string) {
        if (addressee_id !== null)
            try {
                await deleteUserFriendship(addressee_id)
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
            const session = await getSessionUser()
            setUser({ userId: session.user.id, userName: session.user.name })
        }
        getSessionUserId()
    }, [])

    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5 px-4'>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className={`fixed w-full p-2 md:w-2/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl 
                            data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {modalType === 'addNewFriend' && <AddNewFriendModal />}
                        {modalType === 'deleteFriend' && <DeleteFriendModal friend={friendClicked} usersFound={usersFound} setUsersFound={setUsersFound} />}
                    </Dialog.Content>
                </Dialog.Portal>
                <div className='w-full flex items-center border-b-2 border-gray-500 pb-3'>
                    <h2 className='text-2xl'>Friends</h2>
                    <Dialog.Trigger className='ml-auto rounded px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300'
                     onClick={() => setModalType("addNewFriend")}>
                       + Add Friend
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
                {isLoading ? <SkeletonFriends /> :
                    <div className='mt-5 overflow-scroll no-scrollbar'>
                        {/* Users found */}
                        {usersFound.map((item: any, index: number) => (
                            <div key={index} className='relative flex items-center p-2 mb-4 h-16 space-x-4 border border-gray-600 bg-zinc-900 rounded-lg'>
                                <Link href={`/profile/${item.user_name}`} className='flex items-center'>
                                    <div className="w-10 h-10 rounded rounded-full overflow-hidden">
                                        <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" alt='Avatar image' />
                                    </div>
                                    {/* User name */}
                                    <p className='ml-4 text-lg hover:text-green-400'>{item.user_name}</p>
                                </Link>

                                <div className='flex items-center text-base text-gray-400'>
                                    {/* <p className='text-sm'>Joined: {item.user_creationdate.toISOString().split('T')[0]}</p> */}
                                </div>

                                {/* Friend row buttons */}
                                <div className='absolute right-5'>
                                    {userSearchMode === FriendshipStatus.PENDING ? user?.userId === item.requester_id ?
                                        <div className='flex items-center space-x-6'>
                                            <p className='text-gray-300'>Pending</p>
                                            <button className='p-2 rounded rounded-full hover:bg-zinc-700'
                                            onClick={() => removeFriendRequest(item.user_id)}>
                                                <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" stroke="#ffffff" strokeWidth="0.396"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>remove-line</title> <path className="clr-i-outline clr-i-outline-path-1" d="M19.61,18l4.86-4.86a1,1,0,0,0-1.41-1.41L18.2,16.54l-4.89-4.89a1,1,0,0,0-1.41,1.41L16.78,18,12,22.72a1,1,0,1,0,1.41,1.41l4.77-4.77,4.74,4.74a1,1,0,0,0,1.41-1.41Z"></path><path className="clr-i-outline clr-i-outline-path-2" d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"></path><rect x="0" y="0"></rect></g></svg>
                                            </button>
                                        </div> :
                                        <button onClick={() => acceptFriendRequest(item.requester_id)}
                                            className='w-28 text-sm p-1 rounded border border-green-500 hover:bg-green-500 hover:text-black'>Accept</button>
                                        : ""}
                                    {userSearchMode === FriendshipStatus.ACCEPTED ?
                                        <>
                                            <button className='p-2 rounded rounded-full hover:bg-zinc-700'
                                                onClick={() => openChat(item.user_id, item.user_name)}>
                                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z" stroke="#ffffff" strokeWidth="1.5"></path> <path d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                                            </button>
                                            <Dialog.Trigger className='ml-2 p-2 rounded rounded-full hover:bg-zinc-700'
                                                onClick={() => {setModalType("deleteFriend"), setFriendClicked(item)}}>
                                                <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" stroke="#ffffff" strokeWidth="0.396"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>remove-line</title> <path className="clr-i-outline clr-i-outline-path-1" d="M19.61,18l4.86-4.86a1,1,0,0,0-1.41-1.41L18.2,16.54l-4.89-4.89a1,1,0,0,0-1.41,1.41L16.78,18,12,22.72a1,1,0,1,0,1.41,1.41l4.77-4.77,4.74,4.74a1,1,0,0,0,1.41-1.41Z"></path><path className="clr-i-outline clr-i-outline-path-2" d="M18,34A16,16,0,1,1,34,18,16,16,0,0,1,18,34ZM18,4A14,14,0,1,0,32,18,14,14,0,0,0,18,4Z"></path><rect x="0" y="0"></rect></g></svg>
                                            </Dialog.Trigger>
                                        </>
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
                }
            </Dialog.Root>
        </div>
    )
}