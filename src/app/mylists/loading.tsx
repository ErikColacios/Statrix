import React from "react"
import LoadingAnimation from "../components/LoadingAnimation"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center bg-black w-full text-white text-2xl h-96 space-y-8">
            <p>Loading lists</p>
            <LoadingAnimation/>
        </div>
    )
  }