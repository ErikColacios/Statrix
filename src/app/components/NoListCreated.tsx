import React from "react";
import Link from "next/link";
import { getSession } from "../actions/getSession";

export default async function NoListCreated(){

    const session = await getSession()

    return(
        <div className='flex w-full h-64 items-center justify-center rounded bg-black text-white border'>
            <div className="flex flex-col text-center items-center">
                <p className="text-xl md:text-4xl mb-4">{session.user_name} has no lists yet, create one</p>
                <Link href={"newVideogameList"} className="w-full text-md md:text-xl p-2 md:p-4 bg-green-500 transition hover:bg-green-600">Create list</Link>
            </div>
        </div>
    )
}