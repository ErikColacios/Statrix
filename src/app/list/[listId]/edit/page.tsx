import { getListContent } from "@/app/actions/getListContent";
import { getListInfo } from "@/app/actions/getListInfo";
import { getSession } from "@/app/actions/getSession";
import SearchGameBar from "@/app/components/SearchGameBar";
import React from "react"

export default async function editList({params}: {params: {listId:string}}) {

    let listId = params.listId;
    const session = await getSession()
    let user_id:string | undefined = session.user_id;

    let listInfo:any | undefined = []
    let listContent:any | undefined = []
    
    // Select de toda la informacion de la lista del USUARIO 
    if(user_id !== undefined){
        listInfo = await getListInfo(listId, user_id)
        listContent = await getListContent(listId, user_id)
    }

    
    // Catch - Muestras mensaje de error en la pantalla (por si alguien ha entrado en la ruta por error)

    return (
        <div className="flex flex-col md:flex-row w-full text-white h-full">
            {/* Edit - List info */}
            <div className="flex flex-col md:w-1/2">
                <p className="text-3xl">Edit list</p>
                {listInfo.map((item:any, index:number) => (
                        <div key={index}>
                            <p>Creation date: {item.list_creationdate_res}</p>
                            <label htmlFor="listName" className="text-2xl mt-4 p-3 bg-purple-600 border border-purple-600 rounded-s">List name</label>
                            <input className="w-96 text-black text-2xl p-3 focus:outline-none rounded-e" type="text" name="listName" id="listName" value={item.list_name_res}/>
                            <p>{item.list_id_res}</p>
                        </div>
                ))}
            </div>

            {/* Edit - List content */}
            <div className="md:w-1/3 h-[50rem] p-4 border flex flex-col text-xl ">
                {/* Search game */}
                <SearchGameBar/>
                <p>Games on the list</p>
                <div className="overflow-scroll no-scrollbar">
                    {listContent.map((item:any, index:number) => (
                        <div key={index} className="relative flex items-center bg-gray-900 mb-2">
                            <img src={item.videogame_base_image} className="w-8 md:w-12 mr-4" width={80} height={60} alt={'Videogame cover'}/>
                            <p>{item.videogame_name}</p>
                            <button className='ml-4 flex items-center'><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0 mr-4'/></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 border flex flex-col md:w-1/3">
                <p>Games added</p>
                <div id="gamesAdded" className="flex flex-col  text-sm">
                       {/* Games that will be added */}
                </div>
            </div>
        </div>
    )
}