import React from 'react'
import { getListsUser } from '@/actions/getListsUser'
import { List } from '@/types/List'
import getSessionUser from '@/actions/getSessionUser';
import ListsGrid from '@/components/ListsGrid';

export default async function MyLists() {
    const session: any = await getSessionUser();
    const userId: string = session.user.id as string
    const userLists: List[] = await getListsUser(userId, false)

    return (
        <div className='md:grid grid-cols-2 gap-6'>
            <ListsGrid userLists={userLists} /> 
        </div>
    )
}