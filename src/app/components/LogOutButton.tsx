import React from "react";
import { getSession } from "../actions/getSession"
import { logOut } from "../actions/logOutUser"

const LogOutButton = async() => {
    const session = await getSession()
    return (
        <form action={logOut}>
            <button className="hover:text-green-400">Log out</button>
        </form>
    )
}

export default LogOutButton