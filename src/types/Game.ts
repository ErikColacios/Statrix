import { GameStatus } from "@/enums/GameStatus"

// This type is used when the game is processed in the Statrix database, for example when a user has saved in his 'user_videogame' table or 'list_games'
export type Game = {
    game_id:number,
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
    status: GameStatus,
    year_completed:string
}