'use client'
import { useState } from 'react'
import SearchGameBar from "@/app/components/SearchGameBar";
import React, { useEffect } from "react"
import { Videogame } from '@/app/types/Videogame';
import { getListContent } from '@/app/actions/getListContent';
import updateList from '@/app/actions/updateList';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function EditPage({listId, getUserServerSide, getListContentServerSide}:any) {
    
    const router = useRouter()
    let [oldGamesList, setOldGamesList] = useState<Videogame[]>([])
    let [newGamesAdded, setNewGameAdded] = useState<Videogame[]>([])

    function addNewGame(videogame:Videogame) {
        setNewGameAdded([...newGamesAdded, videogame])
    }

    async function removeAddedGame(videogame_id:number){
        setNewGameAdded(newGamesAdded.filter(item => item.id !== videogame_id))
    }

    async function removeGamesInList(videogame_id:number){
        setOldGamesList(oldGamesList.filter(item => item.videogame_id !== videogame_id))
    }

    let listContent:any | undefined = []

    useEffect(() => {
        const fetchListGames = async () => {
            try{
                const user = await getUserServerSide()
                listContent = await getListContentServerSide(listId, user)
                setOldGamesList(listContent)
            }catch(error){
                console.log(error)
            }
        }
        fetchListGames()
    }, [])
    
    async function saveChanges() {
        const list_name_input = document.getElementById("listName") as HTMLInputElement
        const list_name:string = list_name_input.value
        if(list_name==""){
            Swal.fire({
                position: "top-end",
                color: "#d9372b",
                title: "The list name can't be empty!",
                showConfirmButton: false,
                timer: 2200,
                backdrop: false
              });
        }
        
        else if(oldGamesList.length ==0 && newGamesAdded.length == 0){
            Swal.fire({
                position: "top-end",
                color: "#d9372b",
                title: "You must select at least 1 game",
                showConfirmButton: false,
                timer: 2200,
                backdrop: false
              });
        }
        
        else {
            updateList(listId, list_name, oldGamesList, newGamesAdded)
            Swal.fire({
                title: "List updated successfuly!",
                icon: "success"
              })
              router.push("/list/" + listId)
        }
    }

    return (
        <>
            <button className="absolute flex items-center top-0 right-0 p-2 md:p-3 text-md md:text-2xl bg-green-500 hover:bg-green-600" onClick={saveChanges}>
                <img src="/staticImages/icon_confirmation.png" width={25}/>
                <p className='hidden md:block md:ml-2'>Save changes</p>
            </button>

            <div className="flex flex-col md:flex-row w-full text-white h-full">
            {/* Edit - List content */}
            <div className="md:w-1/3 h-[30rem] md:h-[40rem] p-4 border flex flex-col text-xl ">
                {/* Search game */}
                <SearchGameBar addNewGame={addNewGame}/>
                <p>Games on the list</p>

                {/* Old games added */}
                <div className="overflow-scroll no-scrollbar">
                    {oldGamesList.map((item:any, index:number) => (
                        <div key={index} className="relative flex items-center bg-gray-900 mb-2">
                            <img src={item.videogame_base_image} className="w-8 md:w-12 mr-4" width={80} height={60} alt={'Videogame cover'}/>
                            <p>{item.videogame_name}</p>
                            <button className='ml-4 flex items-center' onClick={()=> removeGamesInList(item.videogame_id)}><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0 mr-4' /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* New games added */}
            <div className="p-4 border flex flex-col md:w-1/3">
                <p>Games added</p>
                <div id="gamesAdded" className="flex flex-col  text-sm">
                    {newGamesAdded.map((item,index)=>(
                        <div key={index} className='relative flex items-center bg-gray-700 w-full p-1 mb-1 hover:bg-lime-300 hover:text-green-800' ><img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className='w-8 mr-4' alt='Videogame cover'/><p>{item.name}</p>
                            <button className='flex items-center w-5 absolute right-0 mr-4' ><img src="/staticImages/icon_remove.png" id='btnRemoveGame' onClick={()=>removeAddedGame(item.id)}/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
        
    )
}