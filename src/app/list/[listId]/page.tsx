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
        <div className="p-24 text-2xl bg-black text-white h-full">
            <Link href="../mylists" className="text-green-500 hover:text-green-600">BACK TO MY LISTS</Link>
            
            {/* <h1>List: {params.listId}</h1> */}
            {listInfo.map((item:any) => (
                <div className="relative flex items-center mt-8 mb-8 space-x-32">
                    <p className="text-3xl">{item.list_name_res}</p>
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
                        <p className="ml-32">{item.videogame_name}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}