import React from "react";
import { getSession } from "@/app/actions/getSession";
import EditPage from "./editPage";
import { getListInfo } from "@/app/actions/getListInfo";
import Link from "next/link";

export default async function editList({params}: {params: {listId:string}}) {

    let listId:string = params.listId;
    let listInfo:any | undefined = []

    const session = await getSession()
    let user_id:string | undefined = session.user_id

    // Select de toda la informacion de la lista del USUARIO 
    if(user_id !== undefined){
        listInfo = await getListInfo(listId, user_id)
    }


    async function getUser(){
        "use server"
        let user_id:string | undefined = session.user_id
        return user_id
    }

    
    // Catch - Muestras mensaje de error en la pantalla (por si alguien ha entrado en la ruta por error)

    return (
        <div className="text-white">
        {/* BACK TO LIST */}
        <Link href={"/list/"+listId} className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-48 rounded">
            <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
            BACK TO LIST
        </Link>
            {/* Edit - List info */}
            <div className="flex flex-col mt-8 mb-6 relative">
                <div className="flex items-center">
                    <h2 className="text-3xl mr-4">Edit list</h2>
                    <img src="/staticImages/icon_edit.png" alt="Edit icon" width={30} />
                </div>
                {listInfo.map((item:any, index:number) => (
                        <div key={index} className="mb-8">
                            <p className="mt-1 mb-1">Creation date: {item.list_creationdate_res}</p>
                            <input className="w-full sm:w-96 text-black text-2xl p-3 focus:outline-none rounded-e" type="text" id="listName" defaultValue={item.list_name_res}/>
                        </div>
                ))}

                <EditPage listId={listId} getUser={getUser} />
            </div>
        </div>
        
    )
}