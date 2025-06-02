import React from "react";

type Props = {
    text: string;
};

export default function DenyButton({ text }: Props){
    return(
        <button className="border border-red-400 text-2xl w-48 p-3 text-center transition hover:bg-red-400 hover:text-black">
            {text}
        </button>
    )
}