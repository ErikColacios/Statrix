import React from 'react'
import getGameInfo from "@/app/actions/getGameInfo"
import Link from "next/link"

export default async function gamePage({params}: {params: {listId:string, gameId:string}}) {

    let gameInfo:any[] = await getGameInfo(params.gameId)
    console.log(gameInfo)

    let imagen:string = ""
    gameInfo.map((item:any)=>{
        imagen = `https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`;
        console.log(imagen)
        }
    )
    

    return(
        gameInfo.map((item:any, index:number)=>(

        <div style={{backgroundImage: `url(${imagen})`}} className="w-full h-full 2xl:h-screen p-8 pt-24 lg:p-18 xl:p-24 text-white bg-center bg-cover relative blurImage" key={index} >
            <Link href={`/list/${params.listId}`} className="group flex items-center text-green-500 text-xl border border-green-600 w-32 rounded hover:text-green-600 blur-none">
                <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
                BACK
            </Link>
            <div className="bg-black border w-full mt-8">
                    <div className="flex flex-col lg:flex-row" >
                        <div className="flex lg:flex-col border blur-none">
                            <div className='w-72 lg:w-96 blur-none'>
                                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} alt="Videogame cover" className="w-full" />
                            </div>
                            <div className="flex flex-col p-4">
                                <p className="font-bold	text-sm sm:text-xl mb-2">Game information</p>
                                <div className='text-sm sm:text-base'>
                                    <span className="text-green-400 mr-2">Release date: </span> <span>{item.release_dates[0] ? item.release_dates[0].human : "Uknown"}</span>
                                </div>
                                <div className='text-sm sm:text-base'>
                                    <span className="text-green-400 mr-2">Developer: </span><span>{item.involved_companies[0] ? item.involved_companies[0].company.name : "-"}</span>
                                </div>
                                <div className='text-sm sm:text-base'>
                                    <span className="text-green-400 mr-2">Editor: </span>
                                    <span>{item.involved_companies[1] ? item.involved_companies[1].company.name : "-"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row blur-none">
                            <div className="w-full sm:w-3/3 border flex flex-col relative">
                                <div className='p-4 sm:p-8'>
                                    <p className="text-2xl mb-2">{item.name}</p>
                                    <p className='text-sm sm:text-base'>{item.summary}</p>
                                </div>
                                <div className='grid xl:grid-cols-2 2xl:grid-cols-3 border 2xl:absolute bottom-0'>
                                    {/* Screenshots */}
                                    <img src={item.screenshots ? `https://images.igdb.com/igdb/image/upload/t_720p/${item.screenshots[0].image_id}.png` : ""} className=' border w-full sm:h-72'/>
                                    <img src={item.screenshots[1] ? `https://images.igdb.com/igdb/image/upload/t_720p/${item.screenshots[1].image_id}.png` : ""} className='border w-full sm:h-72'/>
                                    <img src={item.screenshots[2] ? `https://images.igdb.com/igdb/image/upload/t_720p/${item.screenshots[2].image_id}.png` : ""} className='border w-full sm:h-72'/>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/3 p-4 border">
                                <p className="font-bold	text-xl mb-2">User status</p>
                                <p>No data available yet</p>
                                <p>Coming soon...</p>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        )
        )
    )
}

