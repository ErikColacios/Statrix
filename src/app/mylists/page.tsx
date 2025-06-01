import React from 'react'
import { getSession } from "../actions/getSession"
import { getListsUser } from "../actions/getListsUser"
import { List } from "../types/List"
import Link from "next/link"

export default async function MyLists(){
    const session = await getSession()
    let userLists:List[] = []
    if(session.isLoggedIn){
        userLists = await getListsUser(session)
    }

    return (
        <div>
            {userLists.map((list:any, index:number)=> (
                <Link href={`list/${list.list_id}`} key={index} className="relative flex items-center space-x-24 mb-4 p-4 md:p-8 w-full h-24 border text-white hover:bg-gradient-to-r from-green-500 to-transparent">
                    <p className="text-lg md:text-3xl">{list.list_name}</p>
                    <div className="text-sm absolute right-0 pr-4 text-gray-400">
                        <p>Creation date: {list.list_creationdate.toISOString().split('T')[0]}</p>
                    </div>
                </Link>
                ))
            }
        </div>
    )
}