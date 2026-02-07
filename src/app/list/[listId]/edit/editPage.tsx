'use client'
import React from 'react';
import updateList from '@/actions/updateList';
import CustomModal from '@/components/CustomModal';
import SearchGameBar from '@/components/SearchGameBar';
import { Videogame } from '@/types/Videogame';
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
        setNewGameAdded([...newGamesAdded, game])
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
    })

    async function saveChanges() {
        const list_name_input = document.getElementById("listName") as HTMLInputElement
        const list_name: string = list_name_input.value;
        if (list_name === "") {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='hola' text="The list name can't be empty!" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} />)
        }

        else if (oldGamesList.length == 0 && newGamesAdded.length == 0) {
            setModalTrigger(t => t + 1)
            setShowModal(true)
            setAlert(<CustomModal key={modalTrigger} title='hola' text="You must select at least 1 game" type='alert' action={{ actionName: "displayAlert", parameters: { showModal } }} />)
        }

        else {
            updateList(listId, list_name, oldGamesList, newGamesAdded)
            router.push("/list/" + listId)
        }
    }

    return (
        <>
            {showModal && alert}
            {/* Save changes button */}
            <button className="absolute flex items-center rounded top-0 md:top-5 right-0 p-2 md:p-3 text-md md:text-2xl bg-green-500 hover:bg-green-600" onClick={saveChanges}>
                <img src="/staticImages/icon_confirmation.png" width={25} alt='Icon confirmation'/>
                <p className='hidden md:block md:ml-2'>Save changes</p>
            </button>

            <div className="flex flex-col md:flex-row justify-center w-full text-white h-full">
                {/* Edit - List content */}
                <div className="md:w-2/4 h-[30rem] md:h-[35rem] md:pr-4 flex flex-col text-xl ">
                    {/* Search game */}
                    <SearchGameBar addNewGame={addNewGame} />
                    <p>Games on the list</p>

                    {/* Old games added */}
                    <div className="overflow-scroll no-scrollbar border border-gray-500 mt-1">
                        {oldGamesList.map((item: any, index: number) => (
                            <div key={index} className="relative flex items-center bg-gray-900 mb-2">
                                <img src={item.game_base_image} className="w-8 md:w-12 mr-4" width={80} height={60} alt={'Game cover'}/>
                                <p>{item.game_name}</p>
                                <button className='ml-4 flex items-center' onClick={() => removeGamesInList(item.game_id)}><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0 mr-4' /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New games added */}
                <div className="p-4 border border-gray-500 flex flex-col md:w-2/4">
                    <p>Games added</p>
                    <div id="gamesAdded" className="flex flex-col  text-sm">
                        {newGamesAdded.map((item, index) => (
                            <div key={index} className='relative flex items-center bg-gray-700 w-full p-1 mb-1 hover:bg-lime-300 hover:text-green-800' ><img src={`https://images.igdb.com/igdb/image/upload/t_720p/${item.cover.image_id}.png`} className='w-8 mr-4' alt='Videogame cover' /><p>{item.name}</p>
                                <button className='flex items-center w-5 absolute right-0 mr-4' ><img src="/staticImages/icon_remove.png" id='btnRemoveGame' onClick={() => removeAddedGame(item.id)} alt='Remove icon'/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}