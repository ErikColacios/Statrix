import { UUID } from "crypto";

export type User = {
    user_id: UUID,
    user_name: string,
    user_password: string,
    user_email: string,
    user_lists:number,
    user_creationdate:string
}