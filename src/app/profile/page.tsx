import React from "react";
import { getSession } from "../actions/getSession";
import { redirect } from "next/navigation";
import getUserInfo from "../actions/getUserInfo";
import getUserGameStats from "../actions/getUserGameStats";
import { getUserTotalHoursPlayed } from "../actions/getUserTotalHoursPlayed";
import Link from "next/link";

export default async function Profile() {

    const session = await getSession()
    const user_id:string | undefined = session.user_id
    const user_name:string | undefined = session.user_name
    let userInfo:any | undefined = []
    let userGameStats:any | undefined = []
    let userTotalHoursPlayed:number | undefined


    if(user_id !==undefined){
        userInfo = await getUserInfo(user_id)

        userGameStats = await getUserGameStats(user_id)
        console.log(userGameStats)

        userTotalHoursPlayed = await getUserTotalHoursPlayed(session)
        console.log(userTotalHoursPlayed)
    }

    // Protect route in case someone types the route wihtout logging in
    if(!session.isLoggedIn){
        redirect("/")
    }
       

    return (
        <section className="flex flex-col lg:flex-row space-y-12 lg:space-x-12 w-full h-screen pt-24 p-6 md:p-12 text-white bg-[url('/staticImages/dark_bg.jpg')] bg-cover">
            <div className="flex flex-col lg:w-1/2 xl:w-1/3 shadow-lg bg-zinc-900/80 md:mt-12 greenShadow">

                {/* DIV PROFILE IMAGE */}
                <div className="relative h-70 z-20">
                    <img src="/staticImages/eldenring.jpg" />
                    <div className="w-36 h-36 2xl:w-48 2xl:h-48 rounded-full overflow-hidden ml-6 absolute top-8 sm:top-24 md:top-32 lg:top-14">
                        <img src="/profileImages/riku.jpg" className="h-full w-full object-cover"/>
                    </div>
                </div>

                <div className="p-6 pt-16">
                    <div className="flex items-center relative">
                        <p className="text-4xl font-bold">{user_name}</p>
                        <button className="bg-black border border-[#00FF11] pl-6 pr-6  sm:pl-10 p-2 sm:pr-10 absolute right-0 hover:bg-[#00FF11] hover:text-black">EDIT PROFILE</button>
                    </div>
                    {userInfo.map((item:any, index:number)=>(
                    <div className="mt-4" key={index}>
                        {/* User biography */}
                        <p>{item.user_bio}</p>

                        <div className="flex mt-8 ">
                            <div className="text-md sm:text-lg mr-8 text-green-400">
                                <p>Joined</p>
                                <p>Email</p>
                                <p>Location</p>
                                <p>Webpage</p>
                            </div>
                            <div className="text-md sm:text-lg">
                                <p className="">{item.user_creationdate}</p>
                                <p className="">{item.user_email}</p>
                                <p className="">{item.user_location}</p>
                                <a className="underline" href={"https://"+item.user_webpage} target="_blank" rel="noopener noreferrer">{item.user_webpage}</a>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:w-1/2 xl:w-2/3 p-12 shadow-lg bg-zinc-900/80 greenShadow">
                <div className="flex space-x-8">
                    <div className="flex flex-col items-center text-center w-32">
                        <p className="text-6xl font-bold">{userGameStats.gamesPlayed}</p>
                        <p className="text-green-400">Games played</p>
                    </div>
                    <div className="flex flex-col items-center text-center w-32">
                        <p className="text-6xl font-bold">{userTotalHoursPlayed}</p>
                        <p className="text-green-400">Hours played</p>
                    </div>
                </div>

                
                <p className="text-xl mt-12">Top played games</p>
                <div className="flex space-x-8 mt-4">
                    {userGameStats.topGames.map((item:any, index:number)=>(
                        <Link key={index} href={`gamePage/${item.videogame_id}`} className='group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer w-48 h-64 transition hover:scale-110'>
                            <img src={item.videogame_base_image} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Videogame cover'/>
                            <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                <p className='text-lg '>{item.videogame_name}</p>
                            </div>
                        </Link>
                        ))}
                </div>
            </div>
                
            

        </section>
    )
}