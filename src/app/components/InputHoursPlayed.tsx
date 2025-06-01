"use client"
import React, { ChangeEvent, useState } from 'react';
import updateHoursPlayed from '../actions/updateHoursPlayed';

type Props  = {
    hours_played:number,
    videogame_id: string
}

export default function InputHoursPlayed({hours_played, videogame_id}:Props){

    const [value, setValue] = useState<number|null>(hours_played);

    function checkNumber (e: ChangeEvent<HTMLInputElement>){
        const valueNumber:number | null = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null
        if(!valueNumber){
            setValue(null);

        }else{
            setValue(valueNumber);
            updateHoursPlayed(videogame_id, valueNumber).then(res => {
                console.log(res.message)
            })
        }
    }

    return (
        <div className='flex items-center mr-1'>
            <div className='flex flex-col items-end sm:flex-row sm:items-center'>
                <label className='text-gray-300 text-sm'>Hours</label>
                <input type="number" id={'hours'+videogame_id} className='w-12 lg:w-20 sm:ml-2 pr-1 bg-black border border-gray-500 border-white focus:none text-right' min={0}  onChange={checkNumber} value={value ?? ''}/>
            </div>
        </div>
    )
}