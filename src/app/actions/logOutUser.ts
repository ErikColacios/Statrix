import { redirect } from "next/navigation";
import { getSession } from "./getSession";

export async function logOut(){
    const session = await getSession();
    session.destroy()
    redirect("/")
}