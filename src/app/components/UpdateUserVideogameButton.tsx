"use client"
import React, { ChangeEvent, useState } from 'react';
import updateUserVideogame from '../actions/updateUserVideogame';

type Props = {
    gameId: string;
};

export default function UpdateUserVideogameButton({gameId}:Props){

    async function saveUserVideogame() {
        const newStatus: string = (document.getElementById("status") as HTMLSelectElement).value;
        const newScore: number = (document.getElementById("score") as HTMLInputElement).valueAsNumber;
        const newHoursPlayed: number = (document.getElementById("hoursPlayed") as HTMLInputElement).valueAsNumber;
        await updateUserVideogame(gameId, newStatus, newScore, newHoursPlayed);
    }

    return (
        <button className="p-2 pl-4 pr-4 mt-4 bg-green-500 hover:bg-green-600" onClick={saveUserVideogame}>Save</button>
    )
}
