"use client"
import React, { ChangeEvent, useState } from 'react';
import updateHoursPlayed from '../actions/updateHoursPlayed';

type Props  = {
    hours_played:number,
    game_id: string,
    source: string
}

export default function InputHoursPlayed({hours_played, game_id, source}:Props){

    const [value, setValue] = useState<number|null>(hours_played);

    function checkNumber (e: ChangeEvent<HTMLInputElement>){
        const valueNumber:number | null = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null;
        if (!valueNumber){
            setValue(null);

        } else {
            setValue(valueNumber);
            if(source == "listPage"){
                updateHoursPlayed(game_id, valueNumber).then(res => {
                    console.log(res.message)
                })
            }
        }
    }

    switch(source){
        case "listPage":
            return (
                <input type="number" id={'hours'+game_id} className='w-12 p-1 rounded bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 text-right' min={0}  onChange={checkNumber} value={value ?? ''}/>
            )
        case "gamePage":
            return (
                <input type="number" id={'hoursPlayed'} className='text-base w-20 rounded text-2xl pr-1 bg-black border border-gray-500 outline-none text-right' min={0}  onChange={checkNumber} value={value ?? ''}/>
            )
    }
}