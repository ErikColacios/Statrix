import React from 'react'
import getGameInfo from "@/app/actions/getGameInfo"
import Image from "next/image"
import Link from "next/link"

export default async function gamePage({params}: {params: {listId:string, gameId:string}}) {

    let gameInfo:any[]= await getGameInfo(params.gameId)
    console.log(gameInfo)

    return(
        <div className="p-8 pt-24 md:p-24 text-white bg-black w-full">
            <Link href={`/list/${params.listId}`} className="group flex items-center text-green-500 text-xl border border-green-600 w-32 rounded hover:text-green-600">
                <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
                BACK
            </Link>
            <div className="border w-full mt-8">
                {gameInfo.map((item:any, index:number)=>(
                    <div className="flex flex-col md:flex-row" key={index}>
                        <div className="border">
                            <Image src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} alt="Videogame cover" className="w-[50rem]" quality={100} width={300} height={100}/>
                            <div className="flex flex-col border p-4">
                                <p className="font-bold	text-xl mb-2">Game information</p>
                                <div>
                                    <span className="text-green-400 mr-2">Release date: </span> <span>{item.release_dates[0].human}</span>
                                </div>
                                <div>
                                    <span className="text-green-400 mr-2">Developer: </span><span>{item.involved_companies[0].company.name}</span>
                                </div>
                                <div>
                                    <span className="text-green-400 mr-2">Editor: </span><span>{item.involved_companies[1].company.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="w-full sm:w-2/3 border p-8">
                                <div className="">
                                    <p className="text-2xl">{item.name}</p>
                                    <p>{item.summary}</p>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/3 p-8 w-full border">
                                <p className="font-bold	text-xl mb-2">User status</p>
                            </div>
                        </div>

                    </div>
                    )
                )}
            </div>

        </div>
    )
}

