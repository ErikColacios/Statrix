"use client"
import React from 'react'
import type { Videogame } from '../types/Videogame'
import { insertList } from '../actions/insertList'
import { useState, useEffect, Suspense, HTMLInputTypeAttribute } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { getCovers } from '../actions/getCovers'
import Image from 'next/image'
import SkeletonNewVideogameList from './skeleton'

export default function Listavideojuegos() {

  const router = useRouter()
  let [videogameItems, setVideogameItems] = useState<Videogame[]>([])
  const [gameList, setGameList] = useState<Videogame[]>([])
  const [listName, setListName] = useState<string>("")
  const [countGames, setCountGames] = useState(0)
  const [gameNameSearch, setGameNameSearch] = useState("")
  const [genre, setGenre] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

function Reload(){
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

Reload()


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

    return (
      <div className="flex justify-center md:justify-normal text-white">
        {/* Videogames */}
          <div className="w-full sm:w-5/6 flex justify-center flex-col p-2">
            {/* LIST NAME*/}
            <div className='flex items-center justify-center mt-40 lg:mt-32 mb-8'>
              <p className="text-sm md:text-xl lg:text-4xl 2xl:text-7xl">List name</p>
              <input type="text" placeholder='Super list' className='bg-transparent border-b border-white ml-8 h-8 w-48 lg:h-16 lg:w-96 outline-none text-md lg:text-2xl lg:text-4xl 2xl:text-5xl pl-4 mr-8' onChange={(e) => setListName(e.target.value)}/>
              <button onClick={()=> createList()} className='bg-green-500 rounded-lg text-xs xs:text-sm p-2 md:p-4 lg:text-xl lg:w-48 hover:bg-green-600'>CREATE</button>
            </div>

            <div className='p-8 lg:p-16'>
              {/* Search game */}
              <div className='flex items-center justify-center w-full pb-4 text-xs lg:text-xl'>
                <label htmlFor="searchGame">Search game</label>
                <input type="text" name="searchGame" id="searchGame" className='ml-6 w-96 p-2 bg-black outline-none border'/>
                <button className='bg-purple-500 p-2 rounded ml-2 hover:bg-purple-600' onClick={handleSearchGame}><img src="/staticImages/icon_search.png" alt="Search" className='w-8' width={12} height={12}/></button>
              </div>
              <p className='text-xl mt-6'>Genres</p>
              <div className='w-full grid mt-2 mb-8 justify-center text-sm   md:text-xl grid-cols-3 md:grid-cols-6 gap-3'>
                <button className='border p-2 transition hover:bg-yellow-300 hover:border-none' onClick={()=> handleSetGenre(5)}>Shooter</button>
                <button className='border p-2 transition hover:bg-green-500 hover:border-none' onClick={()=> handleSetGenre(12)}>RPG</button>
                <button className='border p-2 transition hover:bg-blue-700 hover:border-none' onClick={()=> handleSetGenre(4)}>Fighting</button>
                <button className='border p-2 transition hover:bg-red-600 hover:border-none' onClick={()=> handleSetGenre(10)}>Racing</button>
                <button className='border p-2 transition hover:bg-cyan-500 hover:border-none' onClick={()=> handleSetGenre(14)}>Sport</button>
                <button className='border p-2 transition hover:bg-purple-700 hover:border-none' onClick={()=> handleSetGenre(13)}>Simulator</button>
              </div>

              {/* --- VIDEOGAMES SHOWN ---- */}
              {isLoading ? <SkeletonNewVideogameList/> : <div className='grid justify-center md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                {videogameItems.map((videogame, index:number)=> (
                  <div key={index} className='group relative flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer w-48 h-64 transition hover:scale-110' onClick={()=> handleSetGameList(videogame)}>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${videogame.cover.image_id}.png`} className='w-full h-full transition duration-300 group-hover:blur-sm group-hover:brightness-50' width={80} height={80} alt='Videogame cover'/>
                    <div className='absolute text-center mt-8 hidden transition delay-400 ease-in-out group-hover:-translate-y-6	group-hover:block'>
                      <p className='text-lg '>{videogame.name}</p>
                    </div>
                  </div>
                ))}
              </div> }
              
              
            </div>
          </div> 
          {/* Sidebar - Games added */}
          <div className={`${showSidebar ? 'h-[50rem] 2xl:h-[55rem]':'h-16 2xl:h-16'} bg-black flex flex-col text-white w-64 2xl:w-80 p-4 right-0 border-2 border-white z-0 mt-16 mr-4 fixed`}>
            <div className='w-full'>
              <div className='flex items-center relative'>
                <p className='text-lg 2xl:text-2xl'>Games added</p>
                <p className='text-lg 2xl:text-2xl ml-14'>x{countGames}</p>
                <button className='absolute right-0' onClick={()=>setShowSidebar(!showSidebar)}><Image src="/staticImages/icon_minimize.png" className='w-5 lg:w-7' alt="Minimize button" width={50} height={50}/></button>
              </div>

            </div>
            <div className='sidebar overflow-scroll no-scrollbar'>
            <div className='flex'>
                <span className='bg-white w-full h-[1px] mt-2 mb-4'></span>
              </div>
              {gameList.map((gameInList, index) => (
                  <div key={index} className='flex items-center mb-3 w-full relative'>
                    <img src={`https://images.igdb.com/igdb/image/upload/t_720p/${gameInList.cover.image_id}.png`} className='w-10 h-12' width={70} height={70} alt='Videogame cover sidebar'/>
                    <p className='text-md ml-4'>{gameInList.name}</p>
                    <button className='ml-4 flex items-center'><Image src="/staticImages/icon_remove.png" alt="Remove icon" width={80} height={80} className='w-5 absolute right-0' onClick={()=> unselectGameList(gameInList.id)}/></button>
                  </div>
              ))}
            </div>
          </div>
      </div>
      
    )
  
}