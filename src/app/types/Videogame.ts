export type Videogame = {
    videogame_id: number 
    id: number,  // the same as videogame_id
    name: string,
    videogame_name: string,
    summary: string,
    cateogry: number,
    cover:{
        image_id:number,
        url:string
    },
    videogame_base_image:string,
    score:number
    hours_played:number

}