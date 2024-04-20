import React from "react";
import Link from "next/link";
import localFont from 'next/font/local'

const infiniteBeyondFont = localFont({src: 'fonts/InfiniteBeyondItalic-rgPlO.ttf'})

export default async function Home() {

  return (
    <div className="flex h-screen bg-black text-white items-center">
        <div className="w-2/3">
          <div className="flex w-72 md:w-[30rem] flex-col text-left border rounded-2xl border-lime-300 p-8 md:p-12 ml-8">
            <h1 className={`text-5xl md:text-7xl tracking-wider ${infiniteBeyondFont.className}`}>STATRIX</h1>
            <p className="mt-2 text-sm md:text-lg">Keep track of what you play.</p>
            <Link href={"newVideogameList"} className="border border-green-400 text-2xl w-48 p-3 mt-4 text-center transition hover:bg-green-400 hover:text-black">GET STARTED</Link>
          </div>
        </div>
    </div>
  );
}
