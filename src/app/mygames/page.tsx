"use server"
import React from 'react'
import getUserVideogameAll from '@/actions/getUserVideogameAll'
import UserVideogame from '@/components/UserVideogame'

export default async function MyGames() {

    let userGames: any[] = await getUserVideogameAll()

    return (
        <UserVideogame userGames={userGames} />
    )
}