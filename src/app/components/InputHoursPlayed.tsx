"use client"
import React, { ChangeEvent, useState } from 'react';
import updateHoursPlayed from '../actions/updateHoursPlayed';

type Props  = {
    hours_played:number,
    list_id:string,
    videogame_id: string
}

export default function InputHoursPlayed({hours_played, list_id, videogame_id}:Props){

    const [value, setValue] = useState<number|null>(hours_played);

    function checkNumber (e: ChangeEvent<HTMLInputElement>){
        const valueNumber:number | null = !Number.isNaN(e.target.valueAsNumber) ? e.target.valueAsNumber : null
        if(!valueNumber){
            setValue(null);

        }else{
            setValue(valueNumber);
            updateHoursPlayed(list_id, videogame_id, valueNumber)
        }
    }

    /* Before I used a button to save the changes */
    // function handleHoursPlayed (){
    //     const newHoursPlayedInput = document.getElementById("hours"+videogame_id) as HTMLInputElement
    //     const newHoursPlayed = newHoursPlayedInput.value
    //     //updateHoursPlayed(list_id, videogame_id, newHoursPlayed)
    // }

    return (
        <div className='flex items-center mr-1'>
            <div className='flex flex-col items-end sm:flex-row'>
                <label>Hours </label>
                <input type="number" id={'hours'+videogame_id} className='w-12 lg:w-20 sm:ml-2 pr-1 bg-black border border-white focus:none text-right' min={0}  onChange={checkNumber} value={value ?? ''}/>
            </div>
            {/* <button className='border border-black bg-green-500 sm:bg-black hover:bg-green-500 hover:border hover:border-green-500 p-1 ml-1' onClick={handleHoursPlayed}><img src="/staticImages/icon_confirmation.png" className='w-5' alt="Confirmation button"/></button> */}
        </div>
    )
}