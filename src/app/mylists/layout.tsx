import { getSession } from "../actions/getSession"
import { supabase } from '../../utils/supabase'
import NoListCreated from "../components/NoListCreated"
import NotLoggedVideogamelist from "../components/NotLoggedVideogamelist"
import { IronSession } from "iron-session"
import { SessionData } from "@/session_lib"
import Link from "next/link"

export default async function VideogameslistLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {

    /**
     * Checks if the user has created a list
     * @param session 
     * @returns numberOfLists
     */
    async function getUserListsNumber(session:IronSession<SessionData>) {
      const {data:user} = await supabase.from('user').select('user_id, user_name, user_lists').eq('user_id',session.user_id)
      let numberOfLists:number = 0;
      if(user != null){
        user.map((item)=>(
          numberOfLists = item.user_lists
        ))
      }

      return numberOfLists;
  }
  
    const session = await getSession()
    let numberOfLists = await getUserListsNumber(session)
    let userHasNoLists:boolean = false;

    if (!session.isLoggedIn){
        return(
            <NotLoggedVideogamelist/>
        )
    }
    else if(numberOfLists===0){
      userHasNoLists = true;
      console.log("User: "+ session.user_name +" - Number of lists: " + numberOfLists)
    }
    else{
      console.log("User: "+ session.user_name +" - Number of lists: " + numberOfLists)
    }

    return (
      <section className="w-full h-full bg-black text-white p-16 pt-32">
        <div className="flex items-center text-3xl pb-8">
          <h2>{session.user_name} videogame lists ( {numberOfLists} )</h2>
          <Link href={"newVideogameList"} className="text-2xl w-48 text-center p-1 ml-28 rounded bg-green-500 hover:bg-green-600">+ Add list</Link>
        </div>
        {/* If the user has no lists, shows the component NoListCreated, if not it shows the children (mylists) */}
        {userHasNoLists ? <NoListCreated/> : children}
      </section>
    )
  }