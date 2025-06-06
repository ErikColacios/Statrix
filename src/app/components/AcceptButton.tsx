import React from "react";

type Props = {
    text: string;
};

export default function AcceptButton({ text }: Props){
    return(
        <button className="border border-green-400 text-sm md:text-lg xl:text-2xl w-32 md:w-48 p-3 text-center transition hover:bg-green-400 hover:text-black">
            {text}
        </button>
    )
}