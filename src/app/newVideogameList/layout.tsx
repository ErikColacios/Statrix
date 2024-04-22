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
      <section>
            {children}
      </section>
    )
  }