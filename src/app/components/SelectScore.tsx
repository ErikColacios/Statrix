"use client"
import React from 'react';
import updateScore from '../actions/updateScore';

type Props  = {
    score:number, 
    videogame_id: string
}

export default function SelectScore({ score, videogame_id}:Props){

    function handleUpdateScore (){
        const newScoreSelect = document.getElementById("score"+videogame_id) as HTMLSelectElement
        const newScore:string = newScoreSelect.value;

        updateScore(videogame_id, newScore).then(res => {
            console.log(res.message)
        })
    }

    return (
        <div className='flex flex-col items-end sm:flex-row sm:items-center  mr-4 md:mr-12'>
            <label className='text-gray-300 text-sm'>Score</label>
            <select id={"score"+videogame_id} className='ml-2 bg-black border border-gray-500 focus:none' defaultValue={score} onChange={handleUpdateScore}>
                <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                <option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>
            </select>
        </div>
    )
}