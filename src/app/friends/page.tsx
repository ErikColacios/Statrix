"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FriendshipStatus } from '../enums/FriendshipStatus'
import getUsers from '../actions/getUsersFriendship'
import { Dialog } from 'radix-ui'
import AddNewFriendModal from '../components/AddNewFriendModal'
import getSessionUser from '../actions/getSessionUser'
import updateUserFriendship from '../actions/updateUserFriendship'
import PrimaryButton from '../components/PrimaryButton'

export default function friends() {

    const [user, setUser] = useState<string | undefined>('')
    const [usersFound, setUsersFound] = useState([])
    const [userSearchMode, setUserSearchMode] = useState<FriendshipStatus>(FriendshipStatus.ACCEPTED)

    async function loadUsers(userSearchMode: FriendshipStatus) {
        let users: any = []
        setUserSearchMode(userSearchMode)
        users = await getUsers(userSearchMode)
        setUsersFound(users)
    }

    async function acceptFriendRequest(requester_id: string) {
        if (requester_id !== null && user !== null)
            try {
                await updateUserFriendship(requester_id, user, FriendshipStatus.ACCEPTED)
            } catch (error) {
                console.log(error)
            }
    }

    useEffect(() => {
        loadUsers(userSearchMode)
        const getSess = async () => {
            const user_id: string | undefined = await getSessionUser()
            setUser(user_id)
        }
        getSess()
    }, [])


    return (
        <div className='w-full lg:w-3/4'>
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
                            <PrimaryButton text="Add a friend"/>
                        </div>
                    </Dialog.Trigger>
                </div>
                <div className='relative flex flex-col'>
                    <div className="flex text-base">
                        <button className={`pl-4 pt-1 pr-4 pb-1 hover:bg-gray-700 ${userSearchMode === FriendshipStatus.ACCEPTED ? 'bg-gray-600' : 'bg-transparent'}`}
                            onClick={() => loadUsers(FriendshipStatus.ACCEPTED)}>Accepted</button>
                        <button className={`pl-4 pt-1 pr-4 pb-1 hover:bg-gray-700 ${userSearchMode === FriendshipStatus.PENDING ? 'bg-gray-600' : 'bg-transparent'}`}
                            onClick={() => loadUsers(FriendshipStatus.PENDING)}>Pending</button>
                        <button className={`pl-4 pt-1 pr-4 pb-1 hover:bg-gray-700 ${userSearchMode === FriendshipStatus.BLOCKED ? 'bg-gray-600' : 'bg-transparent'}`}
                            onClick={() => loadUsers(FriendshipStatus.BLOCKED)}>Blocked</button>
                    </div>
                </div>

                <div className='mt-5 overflow-scroll no-scrollbar'>
                    {/* Users found */}
                    {usersFound.map((item: any, index: number) => (
                        <div key={index} className='relative grid grid-cols-5 items-center p-2 mb-4 h-18 space-x-4 border border-gray-600 bg-gray-800/50 rounded-lg'>
                            <div className='flex items-center'>
                                <div className="w-10 h-10 rounded rounded-full overflow-hidden">
                                    <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" />
                                </div>
                                {/* User name */}
                                <Link href={`/profile/${item.user_name}`} className='ml-4 text-lg hover:text-green-400'>{item.user_name}</Link>
                            </div>

                            <div className='flex items-center text-base text-gray-400'>
                                <p className='text-sm'>Joined: {item.user_creationdate.toISOString().split('T')[0]}</p>
                            </div>

                            <div className='absolute right-5'>
                                {userSearchMode === FriendshipStatus.PENDING ? user === item.requester_id ?
                                    <p>Pending</p> :
                                    <button onClick={() => acceptFriendRequest(item.requester_id)}
                                        className='w-28 text-sm p-1 rounded border border-green-500 hover:bg-green-500 hover:text-black'>Accept</button>
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