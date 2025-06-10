import { getSession } from "../actions/getSession"
import { redirect } from "next/navigation"
import React from "react";
import NewVideogameList from "./page";

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
      <section className="w-full h-screen bg-black text-white pt-16 pb-16">
          { children }
      </section>
    )
  }