import getSessionUser from "@/actions/getSessionUser";
import { redirect } from "next/navigation"
import React from "react";

export default async function NewUserLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {

    const session:any = await getSessionUser()

    if (!session?.user.isNewUser){
        redirect("signup")
    }

    return (
     <div className="h-screen flex flex-col items-center justify-center text-white p-4 md:p-12">
          { children }
      </div>
    )
  }