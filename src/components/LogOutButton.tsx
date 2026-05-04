"use server"
import React from "react";
import { logOutUser } from "../actions/logOutUser"

export default async function LogOutButton({session}:any) {

    return (
        <form action={logOutUser}>
            <button className="hover:text-green-400">Log out</button>
        </form>
    )
}

