"use client"
import React, { useState, useEffect } from 'react';
import updateFavourite from '../actions/updateFavourite';

type Props  = {
    handleStarred: any,
    favourite: boolean,
    gameId: string | undefined
}

export default function StarButton({ handleStarred, favourite, gameId }:Props){
    const [strokeWidth, setStrokeWidth] = useState(1)
    const [fill, setFill] = useState<boolean>(false)

    useEffect(() => {
      setFill(favourite)
    }, [favourite])
    
    
    // function handleStarred (){
    //     const newStarred:boolean = !starred;

    //     //if(gameId)
    //         setStarred(newStarred)
    //         // updateFavourite(gameId, newStarred).then(res => {
    //         //     setStarred(newStarred)
    //         // })
    // }

    return (
        <div className='flex items-center sm:flex-row  mr-4 md:mr-12'>
            <div onClick={handleStarred} onMouseOver={()=> setStrokeWidth(2)} onMouseOut={()=> setStrokeWidth(1)}>
                <svg className={fill ? "hidden" : ""} width="20px" height="28px" viewBox="0 0 33.00 33.00" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#fcfcfc" strokeWidth="0.132"><title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" strokeWidth="0.858" fill="none" fillRule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill=""> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g><g id="SVGRepo_iconCarrier"> <title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" strokeWidth={strokeWidth} fill="none" fillRule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill=""> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g></svg>
                <svg className={fill ? "" : "hidden"} width="20px" height="28px" viewBox="0 -0.5 33 33" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#000000" strokeWidth="0.132"></g><g id="SVGRepo_iconCarrier"> <title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill="#ffffff"> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g></svg>
            </div>
        </div>
    )
}