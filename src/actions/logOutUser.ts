import { signOut } from "next-auth/react";

export async function logOut(){
    await signOut({ callbackUrl: "/" })
}