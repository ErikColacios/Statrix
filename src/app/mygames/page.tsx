"use server"
import React from 'react'
import getSessionUser from '@/actions/getSessionUser';
import getUserVideogameAll from '@/actions/getUserVideogameAll';
import { Game } from '@/types/Game';
import UserVideogame from '@/components/UserVideogame';

export default async function MyGames() {
    const session: any = await getSessionUser();
    const userGames: Game[] = await getUserVideogameAll()

    return (
        <div className='flex flex-col space-y-4'>
            <UserVideogame userGames={userGames} />
        </div>
    )
}