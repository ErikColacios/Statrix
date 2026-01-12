import React from "react";

type Props = {
    text: string
};

export default function PrimaryButton({ text }: Props) {
    return (
        <button
        className="text-md sm:text-lg text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
            {text}
        </button>
    )
}