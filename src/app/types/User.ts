import { UUID } from "crypto";

export type User = {
    user_id: UUID,
    user_name: string,
    user_password: string,
    user_bio:string,
    user_email: string,
    user_location:string,
    user_webpage:string,
    user_avatar:string,
    user_banner:string,
    user_lists:number,
    user_creationdate:string
}