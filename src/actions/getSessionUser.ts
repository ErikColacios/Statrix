"use server"
import { getSession } from "./getSession"

export default async function getSessionUser() {
    const session = await getSession()
    const user_id = session.user_id
    const user_name = session.user_name

    const user:User = {user_id: user_id, user_name: user_name}
    return user;
}