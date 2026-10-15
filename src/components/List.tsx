import { ListMode } from "@/enums/ListMode"
import React from "react"

export default function List({list}: any) {

    return (
        <div className='w-full flex flex-col bg-zinc-900 border border-white/10 hover:bg-zinc-800 hover:border-green-500 rounded-2xl overflow-hidden'>
            <div className='relative flex w-full h-48 bg-black'>
                {list.covers.map((cover: any, i: number) => (
                    <img key={i} src={cover.gameBaseImage} className='absolute w-36 h-48 rounded-tr-xl border border-gray-600'
                        style={{
                            left: `${i * 20}%`, zIndex: list.covers.length * 10 - (i * 10),
                        }}
                        alt='Cover image' />
                ))}
            </div>
            <div className='flex items-center p-6'>
                        <div className='flex flex-col w-full '>
                            <p className="text-2xl text-gray-200">{list.listName}</p>
                            <div className="flex items-center text-sm text-gray-400 pt-2">
                                <p>Games: {list.listGames}</p>
                                
                                <span className={`${list.listMode === ListMode.UNRANKED ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"} ml-4 px-2 py-1 mt-1 text-xs rounded`}>
                                    {list.listMode}
                                </span>
                                <p className="ml-auto ">{list.listCreationDate}</p>
                            </div>
                        </div>
                    </div>
        </div>
    )
}