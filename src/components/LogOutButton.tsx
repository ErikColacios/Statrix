"use server"
import React from "react";
import { logOut } from "../actions/logOutUser"

export default async function LogOutButton({session}:any) {

    return (
        <form action={logOut}>
            <button className="hover:text-green-400">Log out</button>
        </form>
    )
}

