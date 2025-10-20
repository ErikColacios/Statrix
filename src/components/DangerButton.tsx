import React from "react";

type Props = {
    text: string;
};

export default function DangerButton({ text }: Props){
    return(
        <button className="text-lg text-white px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-800 hover:to-red-800 transition duration-300">
            {text}
        </button>
    )
}