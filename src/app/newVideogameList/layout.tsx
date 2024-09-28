import { getSession } from "../actions/getSession"
import { redirect } from "next/navigation"
import React from "react";

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
      <section className="w-full h-screen bg-[url('/staticImages/dark_bg.jpg')] bg-cover">
          {children}
      </section>
    )
  }