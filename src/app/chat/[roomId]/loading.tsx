import LoadingAnimation from "@/components/LoadingAnimation"
import React from "react"

export default function LoadingRoom() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <LoadingAnimation/>
        </div>
    )
  }