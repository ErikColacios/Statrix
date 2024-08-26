import React from "react";
import { getSession } from "../actions/getSession";
import { redirect } from "next/navigation";
import getUserInfo from "../actions/getUserInfo";
import Link from "next/link";

export default async function Settings(){

    const session = await getSession()
    const user_id:string | undefined = session.user_id
    const user_name:string | undefined = session.user_name
    let userInfo:any | undefined = []

    if(user_id !==undefined){
        userInfo = await getUserInfo(user_id)
    }

    // Protect route in case someone types the route wihtout logging in
    if(!session.isLoggedIn){
        redirect("/")
    }

    return (
        <section className="w-full flex bg-black text-white justify-center p-8 pt-20 lg:p-24">
            <div className="w-full 2xl:w-2/3 flex flex-col bg-gray-800 text-lg p-4 lg:p-8">
                <h2 className="text-3xl text-center">Profile settings</h2>
                <form className="flex flex-col lg:flex-row lg:space-x-16 mt-8">
                    <div>
                        <div className="w-full lg:w-96">
                            <p>Username</p>
                            <input type="text" className="w-full bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={user_name}/>
                        </div>
                        {userInfo.map((item:any, index:number)=>(
                            <div key={index} className="w-full lg:w-96">
                                <div className="mt-4">
                                    <p>Bio</p>
                                    <textarea rows={7} className="w-full bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600 resize-none" defaultValue={item.user_bio} maxLength={250}/>
                                </div>
                                <div className="mt-4">
                                    <p>Email</p>
                                    <input type="email" className="w-full bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_email}/>
                                </div>
                                <div className="mt-4">
                                    <p>Location</p>
                                    <input type="text" className="w-full bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_location}/>
                                </div>
                                <div className="mt-4">
                                    <p>Webpage</p>
                                    <input type="text" className="w-full bg-gray-600 outline-none border border-2 border-gray-600 focus:border-green-600" defaultValue={item.user_webpage}/>
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="w-full flex flex-col lg:items-center lg:text-center mt-12 lg:mt-0">
                        <div>
                            <p className="mb-2">Choose your avatar</p>
                            <div className="w-48 h-48 rounded-full overflow-hidden border border-green-600">
                                <img src="/profileImages/leon.jpg" className="h-full w-full object-cover"/>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="mb-2">Choose your banner</p>
                            <img src="/staticImages/eldenring.jpg" className="border border-green-600"/>
                        </div>

                    </div>

                </form>
                <div className="mt-8">
                    <Link href={"profile"} className="p-2 text-center text-lg bg-green-500 hover:bg-green-600">Save changes</Link>
                </div>
            </div>

        </section>
    )
}