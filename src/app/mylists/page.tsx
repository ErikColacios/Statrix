import React from 'react'
import { getListsUser } from '@/actions/getListsUser'
import { List } from '@/types/List'
import getSessionUser from '@/actions/getSessionUser';
import ListsGrid from '@/components/ListsGrid';
import NoListCreated from '@/components/NoListCreated';

export default async function MyLists() {
    const session: any = await getSessionUser();
    const userId: string = session.user.id as string
    const userLists: List[] = await getListsUser(userId, false)

    if(userLists.length === 0) return (<NoListCreated />)

    return (
        <div className='md:grid grid-cols-2 gap-6'>
            { userLists.length !== 0 && <ListsGrid userLists={userLists} /> }
        </div>
    )
}