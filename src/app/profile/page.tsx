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
        <section className="flex flex-col lg:flex-row space-y-12 lg:space-x-12 w-full h-screen pt-24 p-4 md:p-12 text-white bg-[url('/staticImages/dark_bg.jpg')] bg-cover">
            {userInfo.map((item:any, index:number)=>(
           
            <div className="flex flex-col lg:w-1/3 xl:w-1/3 shadow-lg bg-zinc-900/80 md:mt-12 greenShadow" key={index}>
                {/* DIV PROFILE IMAGE */}
                <div className="relative h-70 z-10">
                    <img src="/staticImages/eldenring.jpg" />
                    <div className="w-28 h-28 md:w-36 md:h-36 2xl:w-48 2xl:h-48 rounded-full overflow-hidden ml-6 absolute top-12 sm:top-32 md:top-32 lg:top-10">
                        <img src={"/profileImages/"+item.avatar_images.avatar_image} className="h-full w-full object-cover"/>
                    </div>
                </div>
                <div className="p-6 pt-16">
                    <div className="flex items-center relative">
                        <p className="text-4xl font-bold">{user_name}</p>
                        {/* Edit profile */}
                        <Link href={"settings"} className="bg-black border border-[#00FF11] pl-6 pr-6  sm:pl-10 p-2 sm:pr-10 absolute right-0 hover:bg-[#00FF11] hover:text-black">EDIT PROFILE</Link>
                    </div>
                    <div className="mt-4" >
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
                </div>
            </div>
            ))}


            <div className="flex flex-col lg:w-2/3 xl:w-2/3 p-4 md:p-10 shadow-lg bg-zinc-900/80 greenShadow">
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
                <div className="flex mt-4">
                    {userGameStats.topGames.map((item:any, index:number)=>(
                        <Link key={index} href={`gamePage/${item.videogame_id}`} className='group relative mr-4 flex justify-center items-center rounded-lg overflow-hidden cursor-pointer w-16 h-21 sm:w-24 sm:h-32 md:w-32 md:h-48 2xl:w-48 2xl:h-64 transition hover:scale-110'>
                            <img src={item.videogame_base_image} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' alt='Videogame cover'/>
                            <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                <p className='text-sm lg:text-lg'>{item.videogame_name}</p>
                            </div>
                        </Link>
                        ))}
                </div>
            </div>
                
            

        </section>
    )
}