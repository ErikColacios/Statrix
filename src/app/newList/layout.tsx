import getSessionUser from "@/actions/getSessionUser";
import { redirect } from "next/navigation"
import React from "react";

export default async function NewListLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {

    const session:any = await getSessionUser()

    if (!session){
        redirect("signup")
    }

    return (
      <section className="w-full h-screen bg-black text-white pt-16 pb-16">
          { children }
      </section>
    )
  }