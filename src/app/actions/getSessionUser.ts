"use server"
import { getSession } from "./getSession"

export default async function getSessionUser() {
    const session = await getSession()
    const user_id = session.user_id
    return user_id;
}