import LoadingAnimation from "@/app/components/LoadingAnimation"
import React from "react"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center bg-black w-full text-white text-2xl h-screen space-y-8">
            <p>Loading list</p>
            <LoadingAnimation/>
        </div>
    )
  }