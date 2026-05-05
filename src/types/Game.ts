export type Game = {
    gameId: number 
    id: number,  // the same as videogame_id
    name: string,
    game_name: string,
    summary: string,
    cateogry: number,
    cover:{
        image_id:number,
        url:string
    },
    game_base_image:string,
    score:number
    hours_played:number,
}