"use server"
import { authOptions } from "@/util/auth"
import { getServerSession } from "next-auth"

export default async function getSessionUser() {
    const session: any = await getServerSession(authOptions)
    if (session) {
        console.log(session.user.name)
        return session;
    }
}