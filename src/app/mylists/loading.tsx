import React from "react"

export default function LoadingLists() {
    return (
        <>
            <div className="mb-5 h-10 border-b border-edge pb-4">
                <div className="h-5 w-48 rounded-md bg-elevated animate-pulse" />
            </div>
            <div className="md:grid grid-cols-2 gap-6">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="mb-4 md:mb-0 overflow-hidden rounded-2xl border border-edge bg-card">
                        <div className="h-48 bg-elevated animate-pulse" />
                        <div className="flex flex-col gap-3 p-6">
                            <div className="h-6 w-2/3 rounded-md bg-elevated animate-pulse" />
                            <div className="h-4 w-1/2 rounded-md bg-elevated animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
