import React from "react";
import Link from "next/link";
import localFont from 'next/font/local'
import { getSession } from "./actions/getSession";

const infiniteBeyondFont = localFont({src: 'fonts/InfiniteBeyondItalic-rgPlO.ttf'})

export default async function Home() {

  const session = await getSession()
  const user = session.user_name
  
    // Get the actual date
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth()+1
    var year = date.getFullYear()
    var user_creationdate:string = day+"/"+month+"/"+year;

    console.log(date.toISOString())

  return (
    <div className="flex h-screen bg-black text-white items-center">
        <div className="p-12">
          {session.isLoggedIn && <p className="text-xl ml-3">Welcome back <span className="text-green-500">{user}</span></p>}
          <div className="flex w-72 md:w-[30rem] flex-col text-left border rounded-2xl border-lime-300 p-8 mt-2 md:p-12">
            <p className="text-gray-400 ml-4">Alpha version</p>
            <h1 className={`text-5xl md:text-7xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</h1>
            <p className="mt-2 text-sm md:text-lg">Keep track of what you play.</p>
            <Link href={"newVideogameList"} className="border border-green-400 text-2xl w-48 p-3 mt-4 text-center transition hover:bg-green-400 hover:text-black">GET STARTED</Link>
          </div>
        </div>
    </div>
  );
}
