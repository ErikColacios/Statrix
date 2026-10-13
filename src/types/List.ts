import { ListMode } from "@/enums/ListMode"

export type List = {
    list_id:string,
    list_name:string,
    list_creationdate:string,
    list_mode: ListMode
    covers:string[]
}