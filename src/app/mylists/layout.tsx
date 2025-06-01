import React from 'react'
import { getSession } from "../actions/getSession"
import NoListCreated from "../components/NoListCreated"
import NotLoggedVideogamelist from "../components/NotLoggedVideogamelist"
import { IronSession } from "iron-session"
import { SessionData } from "@/session_lib"
import Link from "next/link"
import { pool } from '@/util/postgres'
import AcceptButton from '../components/AcceptButton'

export default async function VideogameslistLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {

    /**
     * Gets the number of lists that this User has
     * @param session 
     * @returns numberOfLists
     */
    async function getUserListsNumber(session:IronSession<SessionData>) {
    let numberOfLists:number = 0;
      try{
        const res = await pool.query(`SELECT user_id, user_name, user_lists
            FROM users 
            WHERE user_id='${session.user_id}'`);
        numberOfLists = res.rows[0].user_lists
        }catch(error){
          console.log(error)
        }

      return numberOfLists;
  }
  
    const session = await getSession()
    let numberOfLists = await getUserListsNumber(session)
    let userHasNoLists:boolean = false;

    if (!session.isLoggedIn){
        return(
          <div className='flex h-screen items-center'>
            <NotLoggedVideogamelist/>
          </div>
        )
    }
    else if(numberOfLists <= 0){
      userHasNoLists = true;
      console.log("User: "+ session.user_name +" - Number of lists: " + numberOfLists)
    }
    else{
      console.log("User: "+ session.user_name +" - Number of lists: " + numberOfLists)
    }

    return (
      <section className="w-full h-screen bg-black text-white p-4 pt-20 md:p-16 md:pt-32">
        <div className="flex flex-col md:flex-row md:items-center text-xl md:text-3xl pb-8">
          <h2>{session.user_name} videogame lists ( {numberOfLists} )</h2>
          <Link href={"newVideogameList"} className="md:ml-28"><AcceptButton text='ADD LIST'/></Link>
        </div>
        {/* If the user has no lists, shows the component NoListCreated, if not it shows the children (mylists) */}
        {userHasNoLists ? <NoListCreated/> : children}
      </section>
    )
  }