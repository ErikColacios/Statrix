import React from 'react';
import { getListInfo } from "@/app/actions/getListInfo";
import { getListContent } from "@/app/actions/getListContent";
import { getSession } from "@/app/actions/getSession";

import Link from "next/link";
import Image from "next/image";
import DeleteListButton from '@/app/components/DeleteListButton';
import SelectScore from '@/app/components/SelectScore';
import InputHoursPlayed from '@/app/components/InputHoursPlayed';

export default async function list({params}: {params: {listId:string}}) {
    let listId = params.listId;
    let listInfo:any | undefined = []
    let listContent:any | undefined = []

    const session = await getSession()
    let user_id:string | undefined = session.user_id
 
    if(user_id !== undefined){
        listInfo = await getListInfo(listId, user_id)
        listContent = await getListContent(listId, user_id)

    }

    return (
        
        <div className="text-2xl bg-black text-white"> 
            {/* MY LISTS */}
            <Link href="../mylists" className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-40 rounded">
                <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
                MY LISTS
            </Link>
            
            {listInfo.map((item:any, index:number) => (
                <div className="relative flex flex-col items-center md:flex-row mt-8 mb-8 md:space-x-32" key={index}>
                    {/* List name */}
                    <p className="text-4xl md:text-4xl">{item.list_name_res}</p>
                    <div className='flex space-x-10 md:space-x-16 text-sm pt-2 pb-4 md:pt-0 md:pb-0 md:text-xl'>
                        <p>{listContent.length} games</p>
                        {/* Creation date */}
                        <p>Created</p>
                        <p>{item.list_creationdate_res}</p>
                    </div>

                    <div className="flex items-center text-lg md:text-xl md:absolute md:right-0">
                        {/* Edit list  */}
                        <Link href={`./${listId}/edit`} className='flex items-center md:mb-0 md:text-xl bg-green-500 rounded p-1 pl-2 pr-2 ml-4 mr-4 hover:bg-green-600'><img src="/staticImages/icon_edit.png" alt="Edit icon" width={25} className='pr-2'/> Edit list</Link>

                        {/* Delete list button*/}
                        <DeleteListButton userId={user_id} listId={listId} listName={item.list_name_res}/>
                    </div>
                </div>
            ))}
            <div className="flex flex-col">
                {/* List content */}
                {listContent.map((item:any, index:number) => (
                    <div className="relative flex items-center mb-5 border text-sm md:text-xl " key={index}>
                        <Image src={item.videogame_base_image} className="w-12 md:w-24" width={80} height={60} alt={'Videogame cover'}/>
                        <Link href={`/gamePage/${item.videogame_id}`} className="ml-4 xl:ml-24  hover:text-lime-300 hover:underline">{item.videogame_name}</Link>
                        <div className='flex absolute right-0 md:mr-12'>
                            <SelectScore score={item.score} list_id={listId} videogame_id={item.videogame_id}/>
                            <InputHoursPlayed hours_played={item.hours_played} list_id={listId} videogame_id={item.videogame_id}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}