import Link from "next/link";
import { getSession } from "../actions/getSession";
import LogOutButton from "./LogOutButton";

export default async function Navbar() {

    const session = await getSession()
    
    return(
        <nav className="flex items-center justify-center w-full bg-gray-900 text-white fixed z-50 top p-4">
            <div className="flex flex-row space-x-8">
                <Link href="/" className="hover:text-green-400">Home</Link>
                <Link href="/mylists" className="hover:text-green-400">My lists</Link>
                {!session.isLoggedIn && <Link href="/signup" className="hover:text-green-400">Sign up</Link>}
            </div>
            <div className="flex absolute right-0 mr-8">
                {session.isLoggedIn && <Link href="/profile" className="flex justify-center items-center bg-green-500 rounded pl-3 pr-4 text-center mr-4 hover:bg-green-600"><img src="/staticImages/icon_user.png" className="w-5" alt="User icon" /><p>{session.user_name}</p></Link>}
                {session.isLoggedIn && <LogOutButton/>}
            </div>
        </nav>
    )
}