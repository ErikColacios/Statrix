import { getSession } from "../actions/getSession"
import { supabase } from '../../utils/supabase'
import NotListCreated from "../components/NoListCreated"
import NotLoggedVideogamelist from "../components/NotLoggedVideogamelist"
import { IronSession } from "iron-session"
import { SessionData } from "@/session_lib"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

export default async function VideogameslistLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {

    const session = await getSession()

    if (!session.isLoggedIn){
        redirect("signup")
    }

    return (

      <section>
            {children}

      </section>

    )
  }