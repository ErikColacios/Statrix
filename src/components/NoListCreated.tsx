import React from "react";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";

export default async function NoListCreated(){
    return(
        <div className='flex justify-center items-center bg-zinc-900 border border-gray-600 rounded-sm rounded-lg h-96'>
            <div className='flex flex-col text-center items-center p-2'>
                <p className='text-xl mb-4'>{"Looks like you don't have any lists yet"}</p>
                <Link href={"/newList"}><PrimaryButton text='Create your first list!'/></Link>
            </div>
        </div>
    )
}