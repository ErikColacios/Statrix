import React from "react"
import LoadingAnimation from "@/components/LoadingAnimation"

export default function LoadingNewList() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <LoadingAnimation/>
        </div>
    )
}