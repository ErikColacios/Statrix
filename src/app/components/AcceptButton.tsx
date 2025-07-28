import React from "react";

type Props = {
    text: string;
    size: string
};

export default function AcceptButton({ text, size }: Props){
    if(size === "small"){
        return(
            <button className="border bg-black border-green-400 text-sm md:text-base w-32 h-10 transition hover:bg-green-400 hover:text-black">
                {text}
            </button>
        )
    }else{
        return(
            <button className="border bg-black border-green-400 text-sm md:text-lg xl:text-2xl w-32 md:w-48 p-3 text-center transition hover:bg-green-400 hover:text-black">
                {text}
            </button>
        )
    }

}