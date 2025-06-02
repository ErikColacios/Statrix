import React from 'react';
import { getListInfo } from "@/app/actions/getListInfo";
import { getListContent } from "@/app/actions/getListContent";
import { getSession } from "@/app/actions/getSession";

import Link from "next/link";
import Image from "next/image";
import DeleteListButton from '@/app/components/DeleteListButton';
import SelectScore from '@/app/components/SelectScore';
import InputHoursPlayed from '@/app/components/InputHoursPlayed';
import AcceptButton from '@/app/components/AcceptButton';
import StarButton from '@/app/components/StarButton';
import DenyButton from '@/app/components/DenyButton';
import CustomModal from '@/app/components/CustomModal';
import { deleteList } from '@/app/actions/deleteList';

type SearchParamProps = Record<string, string> | null | undefined;


export default async function list({params, searchParams}: {params: {listId:string}, searchParams: SearchParamProps}) {
    let list_id = params.listId;
    let listInfo:any | undefined = []
    let listContent:any | undefined = []
    const showModal = searchParams?.show;

    const session = await getSession()
    let user_id:string | undefined = session.user_id
 
    if(user_id !== undefined){
        listInfo = await getListInfo(list_id, user_id)
        listContent = await getListContent(list_id, user_id)
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
                    <p className="text-3xl md:text-4xl">{item.list_name}</p>
                    <div className='flex space-x-4 lg:space-x-16 text-sm text-gray-300 pt-2 pb-4 md:pt-0 md:pb-0 md:text-lg'>
                        <p>{listContent.length} games</p>
                        {/* Creation date */}
                        <p>Created: {item.list_creationdate.toISOString().split('T')[0]}</p>
                    </div>

                    <div className="flex items-center text-lg md:text-xl md:absolute md:right-0">
                        {/* Edit list  */}
                        <Link href={`./${list_id}/edit`} className='md:mb-0 p-1 pl-2 pr-2  mr-4'><AcceptButton text='EDIT LIST'/></Link>

                        {/* Delete list button*/}
                        <Link href="?show=true"><DenyButton text={'DELETE LIST'}></DenyButton></Link>
                        {showModal && <CustomModal text="Are you sure that you want to delete this list?" action={{actionName: "deleteList", parameters: {list_id}}} />}
                    </div>
                </div>
            ))}
            <div className="flex flex-col">
                {/* List content */}
                {listContent.map((item:any, index:number) => (
                    <div className="relative flex items-center mb-5 border border-gray-500 rounded text-sm md:text-xl " key={index}>
                        <Image src={item.videogame_base_image} className="w-12 md:w-24" width={80} height={60} alt={'Videogame cover'}/>
                        <Link href={`/gamePage/${item.videogame_id}`} className="ml-4 xl:ml-24  hover:text-lime-300 hover:underline">{item.videogame_name}</Link>
                        <div className='flex absolute right-0 md:mr-12'>
                            <StarButton favourite={item.favourite} videogame_id={item.videogame_id}/>
                            <SelectScore score={item.score} videogame_id={item.videogame_id}/>
                            <InputHoursPlayed hours_played={item.hours_played} videogame_id={item.videogame_id}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}