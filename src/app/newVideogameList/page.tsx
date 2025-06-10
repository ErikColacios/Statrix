"use client"
import React, { useRef } from 'react'
import type { Videogame } from '../types/Videogame'
import { insertList } from '../actions/insertList'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { getCovers } from '../actions/getCovers'
import SkeletonNewVideogameList from './skeleton'
import { useFormState } from 'react-dom'

export default function NewVideogameList() {

  const router = useRouter()
  let [videogameItems, setVideogameItems] = useState<Videogame[]>([])
  const [gameList, setGameList] = useState<Videogame[]>([])
  const [listName, setListName] = useState<string>("")
  const [countGames, setCountGames] = useState(0)
  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchForm, formAction] = useFormState<any, FormData>(handleSearchGame,undefined)
  const sidebarRef = useRef<HTMLDivElement>(null);


function reload(){
  useEffect(()=>{
    const fetchVideogames = async ()=> {
      try{
        // While we fetch the covers, we display the loading animation, then we remove it
        setIsLoading(true)
        const covers = await getCovers(gameNameSearch, genre, 50)
        if(covers){
            setVideogameItems(covers)
            setIsLoading(false)
        }
      }catch(error){
        console.log(error)
        setIsLoading(false)
      }
    } 
    fetchVideogames()
  },[gameNameSearch, genre])
}

reload()


  /**
   * Controls if the game exists in the list, and if it don't, then adds it
   * @param videogame 
   */
  function handleSetGameList (videogame:Videogame) {
    let listLength:number = gameList.length

    if(listLength===0){
      setGameList([...gameList, videogame]),
      setCountGames(countGames+1)
    }else {
      let gameFound = false;
      for(let i=0; i < listLength; i++) {
        if(gameList[i].name === videogame.name){
          Swal.fire({
            position: "top-end",
            title: "This game is already on the list",
            showConfirmButton: false,
            timer: 1500,
            backdrop: false,
          });

          gameFound=true;
          break;
        }
      } 
      if(!gameFound){
        setGameList([...gameList, videogame]),
        setCountGames(countGames+1)
      }
    }
  }


  /**
   * Deletes a videogame from the list searching its videogame_id
   * @param videogame_id 
   */
  function unselectGameList(videogame_id:number){
    setGameList(gameList.filter(item => item.id !== videogame_id))
    setCountGames(countGames-1)
  }

  /**
   * Creates a list using the "insertList" function
   * @returns
   */
  function createList() {
    if(listName==""){
      Swal.fire({
        position: "top-end",
        title: "Introduce a list name",
        showConfirmButton: false,
        timer: 1500,
        backdrop: false
      });
        return;
    }
    else if(countGames==0){
      Swal.fire({
        position: "top-end",
        title: "You must add a videogame first",
        showConfirmButton: false,
        timer: 1500,
        backdrop: false
      });
        return;
    }
    else {
        insertList(listName, gameList)
        Swal.fire({
          title: "List created successfuly!",
          icon: "success"
        })
        router.push("mylists")
    }
  }


  /**
   * Gets the search videogame name input and sets the state gameNameSearch
   */
  function handleSearchGame() {
    const searchGame:HTMLInputElement = document.getElementById("searchGame") as HTMLInputElement
    const name:string = searchGame.value;
    setGameNameSearch(name)
  }

  /**
   * Changes the genre
   */
  function handleSetGenre(genreId:number) {
    setGenre(genreId);
    setGameNameSearch("")
  }

  /**
   * Controls if the user clicked outside the sidebar, if so it hides it
   * @param e Event
   */
  const handleClickOutside = (e:MouseEvent) => {
    if (sidebarRef.current && (!sidebarRef.current.contains(e.target as Node))) {
        setShowSidebar(false);
    }
  };

  useEffect(() => {
    if (showSidebar) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar])

    return (
      <div className='flex'>
        {/* Sidebar */}
        <aside className='hidden sm:flex h-screen flex-col w-36 items-center pt-4 text-sm '>
          <p className="text-gray-200">Genres</p>
          <span className="bg-gray-400 w-[80%] h-px mt-1"></span>
          <div className="flex flex-col pt-4 text-gray-400 pb-4">
            <button className={genre !== 5 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(5)}>Shooter</button>
            <button className={genre !== 12 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(12)}>RPG</button>
            <button className={genre !== 4 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(4)}>Fighting</button>
            <button className={genre !== 10 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(10)}>Racing</button>
            <button className={genre !== 14 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(14)}>Sport</button>
            <button className={genre !== 13 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(13)}>Simulator</button>
          </div>
          <p className="text-gray-200">Categories</p>
          <span className="bg-gray-400 w-[80%] h-px mt-1"></span>
          <div className="flex flex-col pt-4 text-gray-400">
            <button className={genre !== 0 ? `text-left hover:text-green-500` : 'text-left text-green-500 font-bold'} onClick={()=> handleSetGenre(0)}>Trending</button>
          </div>
        </aside>

        {/* Sidebar of games added */}
        <div ref={sidebarRef} className='fixed bottom-0 z-50'>
          <div className={showSidebar ? `overflow-scroll h-96 w-[95%] sm:w-96 no-scrollbar bg-black/70 backdrop-blur-sm border border-gray-600 rounded-2xl m-2 p-4` : 'hidden'}>
          {gameList.map((gameInList, index) => (
              <div key={index} className='flex items-center mb-3 w-full relative'>
                <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-10 h-12' width={70} height={70} alt='Videogame cover sidebar'/>
                <p className='text-sm ml-4'>{gameInList.name}</p>
                <button className='ml-8 flex items-center'><img src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0' onClick={()=> unselectGameList(gameInList.id)}/></button>
              </div>
          ))}
          </div>

          {/* Games counter */}
          <div onClick={()=>setShowSidebar(!showSidebar)} className='flex space-x-2 items-center justify-center w-36 sm:w-96 bg-black/70 backdrop-blur-sm cursor-pointer border hover:border-green-500 pt-2 pb-2 m-2 z-50'>
            <p className='text-xl font-bold'>{countGames}</p>
            <p className='text-gray-300'>Games</p>
          </div>
        </div>










        <div className="flex flex-col w-full pl-4 pr-4 md:pl-8 md:pr-8">
            {/* List name*/}
            <div className='relative w-full flex flex-col md:flex-row md:items-center mb-8 text-2xl sm:text-3xl lg:text-4xl'>
              <span className='text-base md:text-3xl'>New list</span>
              <input type="text" placeholder='Super list' className='bg-transparent border-b border-white pl-4 mr-4 md:ml-4 h-8 w-48 lg:h-16 xl:w-96 outline-none' onChange={(e) => setListName(e.target.value)}/>
              <button onClick={()=> createList()} className="border bg-black border-green-400 text-sm md:text-lg xl:text-2xl w-32 p-3 mt-4 md:mt-0 text-center transition hover:bg-green-400 hover:text-black">
                Create
              </button>

              {/* Search bar */}
              <form className='absolute right-0 flex items-center text-sm border' action={formAction}>
                <input type="text" name="searchGame" id="searchGame" className='w-32 lg:w-full bg-transparent outline-none pl-2' placeholder='Hollow Knight'/>
                <button className='p-1 rounded ml-2' type='submit'><img src="/staticImages/icon_search.png" alt="Search" className='w-5' width={20} height={20}/></button>
              </form>
            </div>


            <div className='flex'>
              {/* --- VIDEOGAMES SHOWN ---- */}
              {isLoading ? <SkeletonNewVideogameList/> : 
              <div className='grid justify-center grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-8'>
                {videogameItems.map((videogame, index:number)=> (
                  <div key={index} className='group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer lg:w-48 lg:h-64 transition hover:scale-110' onClick={()=> handleSetGameList(videogame)}>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${videogame.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Videogame cover'/>
                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                      <p className='text-sm md:text-lg'>{videogame.name}</p>
                    </div>
                  </div>
                ))}
              </div> }
            </div>

          </div>
      </div>
    )
}