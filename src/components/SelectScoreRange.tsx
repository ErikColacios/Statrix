"use client"
import React, { useState } from 'react';
import updateScore from '../actions/updateScore';

type Props  = {
    score:number, 
    game_id: string
}

export default function SelectScoreRange({ score, game_id}:Props){

    const [newScore, setNewScore] = useState<number>(score)

    function handleChangeScore(){
        const scoreValue = document.getElementById("score") as HTMLInputElement
        const newScore:number = parseFloat(scoreValue.value);
        setNewScore(newScore)
    }

    function handleUpdateScore (){
        const newScoreSelect = document.getElementById("score"+game_id) as HTMLSelectElement
        const newScore:string = newScoreSelect.value;

        updateScore(game_id, newScore).then(res => {
            console.log(res.message)
        })
    }

    return (
        <div className='flex flex-col'>
            <div className='flex items-center mb-2'>
                <span className='text-gray-400'>Score</span>
                <span className='ml-4 font-bold'>{newScore}</span>
            </div>
            <input type="range" id="score" name="score" min="0" max="10" step="0.1" value={newScore} className='rangeSlider' onChange={handleChangeScore}/>
        </div>
    )
}