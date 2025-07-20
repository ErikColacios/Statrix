"use client"
import React, { ChangeEvent, useState } from 'react';
import updateHoursPlayed from '../actions/updateHoursPlayed';

type Props  = {
    hours_played:number,
    videogame_id: string,
    source: string
}

export default function InputHoursPlayed({hours_played, videogame_id, source}:Props){

    const [value, setValue] = useState<number|null>(hours_played);

    function checkNumber (e: ChangeEvent<HTMLInputElement>){
        const valueNumber:number | null = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null;
        if (!valueNumber){
            setValue(null);

        } else {
            setValue(valueNumber);
            if(source == "listPage"){
                updateHoursPlayed(videogame_id, valueNumber).then(res => {
                    console.log(res.message)
                })
            }
        }
    }

    switch(source){
        case "listPage":
            return (
                <input type="number" id={'hours'+videogame_id} className='w-12 lg:w-16 pr-1 bg-black border border-gray-500 outline-none rounded text-right' min={0}  onChange={checkNumber} value={value ?? ''}/>
            )
        case "gamePage":
            return (
                <input type="number" id={'hoursPlayed'} className='text-base w-20 rounded text-2xl pr-1 bg-black border border-gray-500 outline-none text-right' min={0}  onChange={checkNumber} value={value ?? ''}/>
            )
    }
}