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

    async function acceptRejectFriendRequest(requester_id: string, friendshipStatus: FriendshipStatus) {
        if (requester_id !== null && user !== null)
            try {
                await updateUserFriendship(requester_id, user?.userId, friendshipStatus)
                setUsersFound(usersFound.filter((u: any) => u.user_id !== requester_id))
            } catch (error) {
                console.log(error)
            }
    }

    async function removeFriendRequest(addressee_id: string) {
        if (addressee_id !== null)
            try {
                await deleteUserFriendship(addressee_id)
                setUsersFound(usersFound.filter((u: any) => u.user_id !== addressee_id))
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

    const tabs: FriendshipStatus[] = [FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING, FriendshipStatus.BLOCKED]

    // Subtitle shown under the user name depending on the tab and who sent the request
    function getFriendSubtitle(item: any): string {
        if (userSearchMode === FriendshipStatus.ACCEPTED) return "Friend"
        if (userSearchMode === FriendshipStatus.BLOCKED) return "Blocked"
        return user?.userId === item.requester_id ? "Request sent" : "Wants to be your friend"
    }

    const iconButtonClass = 'flex items-center justify-center gap-2 h-10 min-w-10 px-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-zinc-300 transition hover:text-white'

    return (
        <div className='w-full sm:w-5/6 2xl:w-3/5'>
            <Dialog.Root>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className={`fixed w-full h-full sm:h-auto sm:w-3/4 lg:w-2/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl
                            data-[state=open]:animate-[dialog-content-show_200ms] data-[state=closed]:animate-[dialog-content-hide_200ms]`}>
                        <Dialog.Title className="DialogTitle"></Dialog.Title>
                        <Dialog.Description className="DialogDescription"></Dialog.Description>
                        {modalType === 'addNewFriend' && <AddNewFriendModal />}
                        {modalType === 'deleteFriend' && <DeleteFriendModal friend={friendClicked} usersFound={usersFound} setUsersFound={setUsersFound} />}
                    </Dialog.Content>
                </Dialog.Portal>

                {/* Header */}
                <div className='w-full flex flex-col sm:flex-row sm:items-end gap-4'>
                    <div>
                        <h2 className='text-3xl md:text-4xl font-bold'>Friends</h2>
                        <p className='text-sm text-zinc-400 mt-1'>Manage your friendships and connect with other players.</p>
                    </div>
                    <Dialog.Trigger className='sm:ml-auto flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300'
                        onClick={() => setModalType("addNewFriend")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6" /><path d="M22 11h-6" /></svg>
                        Add Friend
                    </Dialog.Trigger>
                </div>

                {/* Tabs */}
                <div className='mt-8 inline-flex w-full sm:w-auto p-1 gap-1 rounded-xl border border-white/10 bg-white/5'>
                    {tabs.map((tab: FriendshipStatus) => (
                        <button key={tab}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition
                            ${userSearchMode === tab ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                            onClick={() => loadFriendships(tab)}>
                            {tab}
                            {userSearchMode === tab && !isLoading &&
                                <span className='min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-xs bg-green-500/20 text-green-400'>{usersFound.length}</span>
                            }
                        </button>
                    ))}
                </div>

                {isLoading ? <SkeletonFriends /> :
                    <div className='mt-6 flex flex-col gap-3'>
                        {/* Users found */}
                        {usersFound.map((item: any, index: number) => (
                            <div key={index} className='flex items-center gap-4 p-3 sm:px-4 min-h-20 rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/[0.07] hover:border-white/20 animate-element-appear'>
                                <Link href={`/profile/${item.user_name}`} className='group flex items-center gap-4 min-w-0'>
                                    <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 transition group-hover:ring-green-500/60">
                                        <img src={item.user_avatar ? `https://media.statrix.app/avatars/${item.user_id}/${item.user_avatar}` : "/avatarImages/avatar_default.jpg"} className="h-full w-full object-cover" alt='Avatar image' />
                                    </div>
                                    <div className='min-w-0'>
                                        {/* User name */}
                                        <p className='font-semibold truncate transition group-hover:text-green-400'>{item.user_name}</p>
                                        <p className='text-xs text-zinc-400'>{getFriendSubtitle(item)}</p>
                                    </div>
                                </Link>

                                {/* Friend row buttons */}
                                <div className='ml-auto shrink-0'>
                                    {userSearchMode === FriendshipStatus.PENDING ? user?.userId === item.requester_id ?
                                        // If the user is the requester, we print only the cancel request button
                                        <div className='flex items-center gap-2'>
                                            <span className='hidden sm:flex items-center h-7 px-3 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'>Pending</span>
                                            <button className={`${iconButtonClass} hover:bg-rose-600/80 hover:border-transparent`} title='Cancel request'
                                                onClick={() => removeFriendRequest(item.user_id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                <span className='hidden sm:inline'>Cancel</span>
                                            </button>
                                        </div> :
                                        // If the user is the addressee, we print the accept and reject buttons
                                        <div className='flex items-center gap-2'>
                                            <button className='flex items-center justify-center gap-2 h-10 min-w-10 px-2.5 sm:px-4 rounded-xl text-sm font-semibold bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300' title='Accept'
                                                onClick={() => acceptRejectFriendRequest(item.requester_id, FriendshipStatus.ACCEPTED)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                <span className='hidden sm:inline'>Accept</span>
                                            </button>
                                            <button className={`${iconButtonClass} hover:bg-rose-600/80 hover:border-transparent`} title='Reject'
                                                onClick={() => acceptRejectFriendRequest(item.requester_id, FriendshipStatus.REJECTED)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                <span className='hidden sm:inline'>Reject</span>
                                            </button>
                                        </div>
                                        : ""}
                                    {userSearchMode === FriendshipStatus.ACCEPTED ?
                                        <div className='flex items-center gap-2'>
                                            <button className={`${iconButtonClass} hover:bg-white/10`} title='Send message'
                                                onClick={() => openChat(item.user_id, item.user_name)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                                <span className='hidden sm:inline'>Message</span>
                                            </button>
                                            <Dialog.Trigger className={`${iconButtonClass} hover:bg-rose-600/80 hover:border-transparent`} title='Remove friend'
                                                onClick={() => {setModalType("deleteFriend"), setFriendClicked(item)}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11h-6" /></svg>
                                            </Dialog.Trigger>
                                        </div>
                                        : ''}
                                </div>
                            </div>
                        ))}
                        {usersFound.length === 0 &&
                            <div className='flex flex-col items-center justify-center gap-2 text-center h-64 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-zinc-400'>
                                <p className='text-2xl text-zinc-300'>(－_－) zzZ</p>
                                <p>Nothing to check here by now</p>
                            </div>}
                    </div>
                }
            </Dialog.Root>
        </div>
    )
}
