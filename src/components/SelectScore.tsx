"use client"
import React from 'react';
import updateScore from '../actions/updateScore';

type Props  = {
    score:number, 
    game_id: string
}

export default function SelectScore({ score, game_id}:Props){

    function handleUpdateScore (){
        const newScoreSelect = document.getElementById("score"+game_id) as HTMLSelectElement
        const newScore:string = newScoreSelect.value;

        updateScore(game_id, newScore).then(res => {
            console.log(res.message)
        })
    }

    return (
        <div className='flex flex-col items-end sm:flex-row sm:items-center mr-6'>
            <label className="text-sm text-gray-400 mr-2">Score</label>
            <input id={"score"+game_id} max={10} type="number" className='w-12 pr-1 bg-gray-800 rounded outline-none border border-1 border-gray-700 focus:border-green-600 text-right' defaultValue={score} onChange={handleUpdateScore}/>
        </div>
    )
}