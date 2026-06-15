import React from "react"

export default function List({list}: any) {

    return (
        <div className='w-2/5 flex flex-col bg-zinc-900 border border-gray-600 hover:bg-zinc-800 hover:border-green-500 rounded-2xl overflow-hidden'>
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
                <div className='flex flex-col'>
                    <p className="text-2xl text-gray-200">{list.listName}</p>
                    <p className="text-sm text-gray-400 pt-1">Games: {list.listGames}</p>
                </div>
                <p className="ml-auto text-sm text-gray-400">Created: {list.listCreationDate}</p>
            </div>
        </div>
    )
}