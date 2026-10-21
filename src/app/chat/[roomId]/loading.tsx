import LoadingAnimation from "@/components/LoadingAnimation"
import React from "react"

export default function LoadingRoom() {
    return (
        <div className="relative flex flex-col items-center justify-center w-full md:w-1/2 h-6/7 rounded-2xl sm:rounded-none sm:rounded-e-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl">
            <LoadingAnimation/>
        </div>
    )
  }
