import React from "react"
import { useSortable } from "@dnd-kit/react/sortable"
import { ListMode } from "@/enums/ListMode"

export default function SortableItem({ id, index, imageId, listMode }: any) {
    const { ref } = useSortable({ id, index })

    return (
        <div ref={ref} className="relative rounded-lg overflow-hidden border border-gray-600 cursor-pointer hover:border-green-500">
            <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${imageId}.png`} />
            { listMode === ListMode.RANKED && <span className="absolute bottom-2 right-2 flex h-7 min-w-7 items-center justify-center rounded-md border border-white/10 bg-zinc-950/90 px-1.5 text-xs font-bold text-gray-200 shadow-lg">{index +1}</span> }
        </div>
    )
}