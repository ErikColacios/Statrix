"use client"
import React, { useState } from 'react'
import getUserSearched from '../actions/getUserSearched'
import Link from 'next/link'

export default function friendsLayout() {

    const [usersFound, setUsersFound] = useState([])

    async function searchUser(formData: FormData) {
        const searchedUser: string = formData.get('searchUser') as string
        let users: any = []
        if (searchedUser !== "") {
            users = await getUserSearched(searchedUser)
            setUsersFound(users)
        }
    }

    return (
        <div className='w-1/2'>
            <div className='flex'>
                <h2 className='text-2xl'>Friends</h2>
                {/* Search user */}
                <form className='flex text-sm border ml-auto' action={searchUser}>
                    <input type="text" name="searchUser" id="searchUser" className='w-32 lg:w-full bg-transparent outline-none pl-2' placeholder='Search user' />
                    <button className='p-1 rounded ml-2 transition hover:bg-gray-700' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20} /></button>
                </form>
            </div>
            <div className='mt-6'>
                {/* Users found */}
                {usersFound.map((item: any, index: number) => (
                    <div key={index} className='relative flex items-center p-2 h-18 space-x-4 border border-gray-600 bg-gray-800/50 rounded-lg'>
                        <div className="w-12 rounded rounded-full overflow-hidden">
                            <img src={`/avatarImages/${item.avatar_image}`} className="h-full w-full object-cover" />
                        </div>
                        <Link href={`/profile/${item.user_name}`} className='text-lg hover:text-green-400'>{item.user_name}</Link>
                        <div className='flex items-center pl-8 space-x-10 text-base text-gray-400'>
                            <p>{item.user_location}</p>
                            <p>Joined: {item.user_creationdate.toISOString().split('T')[0]}</p>
                        </div>
                        
                        {/* ADD FRIEND BUTTON */}
                        <button className='absolute right-5 text-sm p-1 rounded border border-green-500 hover:bg-green-500 hover:text-black'>Add friend</button>
                    </div>
                ))}

            </div>
        </div>
    )
}