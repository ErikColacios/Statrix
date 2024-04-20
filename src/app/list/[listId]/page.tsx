import { getListInfo } from "@/app/actions/getListInfo";
import { getListContent } from "@/app/actions/getListContent";
import { getSession } from "@/app/actions/getSession"
import { redirect } from "next/navigation";
import { List } from "@/app/types/List";
import Link from "next/link";


export default async function list({params}: {params: {listId:string}}) {
    const session = await getSession()
    let userId = session.user_id;
    let listId = params.listId;

    let listInfo:any | undefined = []
    let listContent:any | undefined = [] 


    console.log(session.user_name + " entered to list id: " + params.listId)

    if(userId !== undefined){
        listInfo = await getListInfo(listId, userId)
        listContent = await getListContent(listId, userId)
    }

    if(list !== null){
        console.log(list)
    }

    if (!session.isLoggedIn){
        return(
            redirect("/")
        )
    }

    return (
        <div className="p-24 text-2xl bg-black text-white">
            <Link href="../mylists" className="group flex items-center text-green-500 text-xl hover:text-green-600 border border-green-600 w-48 rounded">
                <svg className="w-8 fill-green-500 group-hover:fill-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"/></svg>
                MY LISTS
            </Link>
            
            {/* <h1>List: {params.listId}</h1> */}
            {listInfo.map((item:any, index:number) => (
                <div className="relative flex items-center mt-8 mb-8 space-x-32" key={index}>
                    <p className="text-4xl">{item.list_name_res}</p>
                    <div className="flex absolute right-0">
                        <p className="text-xl">Creation date</p>
                        <p className="text-xl ml-8">{item.list_creationdate_res}</p>
                    </div>
                </div>
            ))}
            <div className="flex flex-col">
                {listContent.map((item:any, index:number) => (
                    <div className="flex items-center mb-8 border" key={index}>
                        <img src={item.videogame_base_image} className="w-24 h-32"/>
                        <Link href={`/gamePage/${params.listId}/${item.videogame_id}`} className="ml-32 hover:text-lime-300 hover:underline">{item.videogame_name}</Link>
                    </div>
                ))}
            </div>

        </div>
    )
}