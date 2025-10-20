import React from "react";
import Link from "next/link";

export default function NotLoggedVideogamelist(){

    return(
        <div className='flex bg-black text-white w-full h-full items-center justify-center w-full h-full'>
            <div className="flex flex-col text-center">
                <p className="text-4xl mb-4">Sign up to create your first list</p>
                <Link href={"signup"} className="text-3xl text-green-400 hover:text-green-600 grayscale-0">GET STARTED</Link>
            </div>
        </div>
    )
}