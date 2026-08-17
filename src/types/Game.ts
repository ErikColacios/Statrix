import { GameStatus } from "@/enums/GameStatus"

export type Game = {
    gameId: number,
    game_id:number,
    id: number,  // the same as videogame_id
    name: string,
    game_name: string,
    summary: string,
    category: number,
    cover:{
        image_id:number,
        url:string
    },
    screenshots:{
        image_id:number
    },
    artworks:{
        image_id:string
    },
    game_image_id:string,
    game_base_image:string,
    score:number
    hours_played:number,
    favourite:boolean,
    status: GameStatus
}