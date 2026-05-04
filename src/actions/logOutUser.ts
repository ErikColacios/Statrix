import { signOut } from "next-auth/react";

export async function logOutUser(){
    await signOut({ callbackUrl: "/" })
}