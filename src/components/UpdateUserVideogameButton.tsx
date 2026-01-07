"use client"
import React from 'react';
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
        <button className="text-white px-6 py-2 mt-4 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300" onClick={saveUserVideogame}>Save</button>
    )
}
