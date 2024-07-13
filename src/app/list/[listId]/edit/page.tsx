import React from "react";
import { getSession } from "@/app/actions/getSession";
import EditPage from "./editPage";
import { getListInfo } from "@/app/actions/getListInfo";

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
        <div className="text-white ">
            {/* Edit - List info */}
            <div className="flex flex-col mb-6 relative">
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