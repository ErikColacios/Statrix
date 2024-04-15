import { UUID } from "crypto";

export type List = {
    videogame_id: UUID,
    list_id: UUID,
    user_id: UUID,
    list_name: string,
    list_creationdate: Date,
    user_name: string,
    videogame_name: string,
}