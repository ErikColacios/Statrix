import React from "react";
import { getSession } from "../actions/getSession";
import { redirect } from "next/navigation";
import getUserInfo from "../actions/getUserInfo";
import Link from "next/link";

export default async function Profile() {

    const session = await getSession()
    const user_id:string | undefined = session.user_id
    const user_name:string | undefined = session.user_name
    let userinfo:any | undefined = []

    if(user_id !==undefined){
        userinfo = await getUserInfo(user_id)
        console.log(userinfo)
    }


    // Protect route in case someone types the route wihtout logging in
    if(!session.isLoggedIn){
        redirect("/")
    }

    {/* <div className="flex items-center justify-center items-center w-full h-full mr-16">
            <div className="h-52 w-52 rounded-full relative overflow-hidden">
                <img src="/profileImages/riku.jpg" className="h-full w-full object-cover"/>
            </div>
            <div>
                <p className="relative text-4xl ml-8">{user_name}</p>
            </div>
    </div> */}
       

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
                    {userinfo.map((item:any, index:number)=>(
                    <div className="mt-4" key={index}>
                        <p className="text-xl mb-1">Biography</p>
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
                        
                        {/* <div className="mt-4">
                                <span className="text-xl mr-12">Joined</span><span>{item.user_creationdate}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl mr-12">Email</span><span>{item.user_email}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl mr-12">Location</span><span>{item.user_location}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl mr-12">Webpage</span><a className="underline" href={"https://"+item.user_webpage} target="_blank" rel="noopener noreferrer">{item.user_webpage}</a>
                            </div> */}
                    </div>
                    ))}
                </div>

            </div>

            <div className="flex flex-col lg:w-1/2 xl:w-2/3 p-12 shadow-lg bg-zinc-900/80 greenShadow">
            <p className="text-2xl mb-12">Game stats</p>
                        Coming soon ...
            </div>


        </section>
    )
}