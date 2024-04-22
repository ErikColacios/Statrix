import React from 'react';
import { getListInfo } from "@/app/actions/getListInfo";
import { getListContent } from "@/app/actions/getListContent";
import { getSession } from "@/app/actions/getSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DeleteListButton from '@/app/components/DeleteListButton';

export default async function list({params}: {params: {listId:string}}) {
    let listId = params.listId;

    let listInfo:any | undefined = []
    let listContent:any | undefined = []

    const session = await getSession()
    let user_id:string | undefined = session.user_id;

    if(!session.isLoggedIn){
        return(
            redirect("/")
        )
    }

    if(user_id !== undefined){
        listInfo = await getListInfo(listId, user_id)
        listContent = await getListContent(listId, user_id)
    }

    if(list !== null){
        console.log(list)
    }
    console.log(user_id)
    console.log(listId)


    return (
        <div className="p-8 md:p-24 pt-20 md:pt-32 text-2xl bg-black text-white">
            <Link href="../mylists" className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-48 rounded">
                <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
                MY LISTS
            </Link>
            
            {listInfo.map((item:any, index:number) => (
                <div className="relative flex flex-col items-center md:flex-row mt-8 mb-8 md:space-x-32" key={index}>


                    <p className="text-2xl md:text-4xl">{item.list_name_res}</p>
                    <div className="flex text-sm md:text-xl md:absolute md:right-0">
                        <DeleteListButton userId={user_id} listId={listId} listName={item.list_name_res}/>
                        <p>Creation date</p>
                        <p className="ml-8">{item.list_creationdate_res}</p>
                    </div>
                </div>
            ))}
            <div className="flex flex-col">
                {listContent.map((item:any, index:number) => (
                    <div className="flex items-center mb-8 border" key={index}>
                        <Image src={item.videogame_base_image} className="w-12 md:w-24" width={80} height={60} alt={'Videogame cover'}/>
                        <Link href={`/gamePage/${params.listId}/${item.videogame_id}`} className="ml-8 md:ml-32 text-sm md:text-xl hover:text-lime-300 hover:underline">{item.videogame_name}</Link>
                    </div>
                ))}
            </div>

        </div>
    )
}