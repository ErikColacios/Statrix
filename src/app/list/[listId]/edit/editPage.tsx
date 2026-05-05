'use client'
import React from 'react';
import updateList from '@/actions/updateList';
import CustomModal from '@/components/CustomModal';
import SearchGameBar from '@/components/SearchGameBar';
import { Videogame } from '@/types/Game';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPage({ listId, getUserServerSide, getListContentServerSide }: any) {

    const router = useRouter()
    let [oldGamesList, setOldGamesList] = useState<Videogame[]>([])
    let [newGamesAdded, setNewGameAdded] = useState<Videogame[]>([])

    // States for the modals and alerts
    const [showModal, setShowModal] = useState(false)
    const [modalTrigger, setModalTrigger] = useState(0)

    // Custom alert
    const [alert, setAlert] = useState(<></>)

    function addNewGame(game: Videogame) {
        setOldGamesList([...oldGamesList, game])
    }

    async function removeAddedGame(game_id: number) {
        setNewGameAdded(newGamesAdded.filter(item => item.id !== game_id))
    }

    async function removeGamesInList(game_id: number) {
        setOldGamesList(oldGamesList.filter(item => item.game_id !== game_id))
    }

    useEffect(() => {
        let listContent: any | undefined = []

        const fetchListGames = async () => {
            try {
                const user = await getUserServerSide()
                listContent = await getListContentServerSide(listId, user)
                setOldGamesList(listContent)
            } catch (error) {
                console.log(error)
            }
        }
        fetchListGames()
    },[])

    async function saveChanges() {
        const list_name_input = document.getElementById("listName") as HTMLInputElement
        const list_name: string = list_name_input.value;
        if (list_name === "") {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='hola' text="The list name can't be empty!" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={()=>setShowModal(false)} />)
        }

        else if (oldGamesList.length == 0 && newGamesAdded.length == 0) {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='hola' text="You must select at least 1 game" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} closeModal={()=>setShowModal(false)} />)
        }

        else {
            updateList(listId, list_name, oldGamesList, newGamesAdded)
            router.push("/list/" + listId)
        }
    }

    return (
        <div className='h-[35rem]'>
            {showModal && alert}
            {/* Save changes button */}
            <button className="absolute top-0 right-0 w-36 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300" 
                onClick={saveChanges}>
                Save changes
            </button>
            <div className="flex flex-col md:flex-row w-full h-full text-base mt-4">
                {/* Edit - List content */}
                <div className="flex flex-col">
                    {/* Search game */}
                    <SearchGameBar addNewGame={addNewGame} />
                    <p className="text-sm text-gray-400">Games on the list</p>

                    {/* Old games added */}
                    <div className="grid grid-cols-6 gap-4 overflow-hidden rounded-2xl my-2">
                        {oldGamesList.map((item: any, index: number) => (
                            <div key={index} className="group w-36 relative text-sm flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer transition hover:scale-110">
                                <img src={item.game_base_image} className="w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50" alt={'Game cover'}/>
                                <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6 group-hover:block'>
                                    <p>{item.game_name}</p>
                                </div>
                                {/* <button className='ml-4 flex items-center' onClick={() => removeGamesInList(item.game_id)}><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0 mr-4' /></button> */}
                            </div>

                        ))}
                    </div>
                </div>

                {/* New games added */}
                {/* <div className="bg-zinc-900 p-4 border border-gray-500 rounded-lg flex flex-col md:w-2/4 mt-4 sm:mt-0">
                    <p>Games added</p>
                    <div id="gamesAdded" className="flex flex-col">
                        {newGamesAdded.map((item, index) => (
                            <div key={index} className='relative flex items-center bg-gray-700 w-full p-1 mb-1 hover:bg-lime-300 hover:text-green-800' ><img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className='w-8 mr-4' alt='Videogame cover' /><p>{item.name}</p>
                                <button className='flex items-center w-5 absolute right-0 mr-4' ><img src="/staticImages/icon_remove.png" id='btnRemoveGame' onClick={() => removeAddedGame(item.id)} alt='Remove icon'/></button>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    )
}