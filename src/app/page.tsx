import React from "react";
import Link from "next/link";
import localFont from 'next/font/local'
import AcceptButton from "./components/AcceptButton";
import {Archivo_Black} from 'next/font/google'

const infiniteBeyondFont = localFont({src: 'fonts/InfiniteBeyondItalic-rgPlO.ttf'})

const archivo_black = Archivo_Black({
  subsets: ['latin'],
  weight: "400"
})

export default async function Home() {
  return (
    <div className="bg-black/80 backdrop-blur-xl flex flex-col sm:flex-row h-screen text-white items-center justify-center sm:justify-start">
        <div className="flex flex-col text-left p-8 mt-2 md:p-24 md:w-[55rem]">
          <p className="text-gray-400 ml-4">Alpha version</p>
          <p className={`${infiniteBeyondFont.className} tracking-wider pl-1 text-green-400 text-4xl`}>STATRIX</p>
          <h1 className={`text-5xl mt-4 mb-8 md:text-7xl ${archivo_black.className}`}>KEEP TRACK OF WHAT YOU PLAY</h1>
          <Link href={"newVideogameList"}><AcceptButton text={"GET STARTED"} /></Link>
        </div>
    </div>
  );
}
