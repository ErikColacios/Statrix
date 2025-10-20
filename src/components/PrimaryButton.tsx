import React from "react";

type Props = {
    text: string
};

export default function PrimaryButton({ text }: Props) {
    return (
        <button className="text-lg text-white px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
            {text}
        </button>
    )
}