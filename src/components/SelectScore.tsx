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
        <div className='flex flex-col items-end sm:flex-row sm:items-center  mr-4 md:mr-12'>
            <label className='text-gray-300 text-sm'>Score</label>
            <input id={"score"+game_id} max={10} type="number" className='w-10 ml-2 pr-1 bg-black outline-none border border-gray-500 rounded text-right' defaultValue={score} onChange={handleUpdateScore}/>
        </div>
    )
}