import React from "react";
import { getListContent } from "@/actions/getListContent";
import { getListInfo } from "@/actions/getListInfo";
import getSessionUser from "@/actions/getSessionUser";
import Link from "next/link";
import EditPage from "./editPage";

export default async function editList({ params }: { params: { listId: string } }) {

    let listId: string = params.listId;
    let listInfo: any | undefined = []

    const session:any = await getSessionUser()
    let userId: string | undefined = session.user.id

    // Select de toda la informacion de la lista del USUARIO 
    if (userId !== undefined) {
        listInfo = await getListInfo(listId, userId)
    }

    /**
     * This server function will be used in the EDIT PAGE (wich is a use_client page)
     * @returns 
     */
    async function getUserServerSide() {
        "use server"
        let userId: string | undefined = session.user.id
        return userId;
    }

    /**
     * This server function will be used in the EDIT PAGE (wich is a use_client page)
     * @returns 
     */
    async function getListContentServerSide(listId: string, userId: string) {
        "use server"
        return await getListContent(listId, userId);
    }

    return (
        <div>
            {/* BACK TO LIST */}
            <Link href={"/list/" + listId} className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-48 rounded">
                <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" /></svg>
                BACK TO LIST
            </Link>
            {/* Edit - List info */}
            <div className="flex flex-col gap-4 my-6 relative">
                <h2 className="text-2xl md:text-3xl mr-4">Edit list</h2>

                <div className="flex items-center">
                    <img src="/staticImages/icon_edit.png" alt="Edit icon" className="hidden md:w-8"/>
                    {listInfo.map((item: any, index: number) => (
                        <div key={index} className="">
                            <p className="text-sm text-gray-400">Name</p>
                            <input className="p-2 bg-gray-800 outline-none border border-1 border-gray-700 focus:border-green-600 p-1 focus:outline-none" type="text" id="listName" defaultValue={item.list_name} placeholder="Super list" maxLength={25}/>
                            <p className="text-sm text-gray-400 mt-1">Creation date: {item.list_creationdate.toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>

                <EditPage listId={listId} getUserServerSide={getUserServerSide} getListContentServerSide={getListContentServerSide} />
            </div>
        </div>
        
    )
}