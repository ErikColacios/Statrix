import React from "react";

type Props = {
    text: string;
};

export default function DenyButton({ text }: Props){
    return(
        <button className="border border-red-400 text-sm md:text-lg xl:text-2xl text-2xl w-36 md:w-48 p-3 text-center transition hover:bg-red-400 hover:text-black">
            {text}
        </button>
    )
}