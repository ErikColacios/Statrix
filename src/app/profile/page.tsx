import Link from "next/link";
import { getSession } from "../actions/getSession";
import { redirect } from "next/navigation";

export default async function Profile() {

    const session = await getSession()

    // Protect route in case someone types the route wihtout logging in
    if(!session.isLoggedIn){
        redirect("/")
    }

    return(
        <div className="p-24 text-white">
            <h3>Profile page</h3>
        </div>
    )
}