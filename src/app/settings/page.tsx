import React from "react";
import { getSession } from "../actions/getSession";
import { redirect } from "next/navigation";
import getUserInfo from "../actions/getUserInfo";
import Link from "next/link";
import UserSettingsForm from "../components/UserSettingsForm";

export default async function Settings(){

    const session = await getSession()
    const user_id:string | undefined = session.user_id
    let userInfo:any | undefined = []

    if(user_id !==undefined){
        userInfo = await getUserInfo(user_id)
    }

    // Protect route in case someone types the route wihtout logging in
    if(!session.isLoggedIn){
        redirect("/")
    }

    return (
        <section className="relative w-full flex bg-black text-white justify-center pt-20 md:p-22 bg-[url('/staticImages/dark_bg.jpg')] bg-cover">
            <div className="w-full 2xl:w-2/3 flex flex-col bg-gray-800 text-lg p-4 lg:p-8 bg-zinc-900/80">
                {/* BACK TO PROFILE */}
                <Link href={"profile"} className="group flex items-center text-green-500 text-base lg:text-xl hover:text-green-600 border border-green-600 w-48 lg:w-64 rounded">
                    <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
                    BACK TO PROFILE
                    </Link>
                <h2 className="text-3xl text-center mt-12 lg:mt-0 mb-8">Profile settings</h2>
                <UserSettingsForm userInfo={userInfo}/>
            </div>
        </section>
    )
}