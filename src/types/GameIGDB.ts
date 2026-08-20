// This type is used when fetching a game from the IGDB api and its not yet in Statrix database
export type GameIGDB = {
    id: number,
    name: string,
    genres: number[]
    cover: {
        id: number,
        image_id:string
    }
    rating:number
}