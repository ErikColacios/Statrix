"use server"

/**
 * Fetches game information from the IDGB Api. The restriction is the game name, the game genre and the limit of responses.
 * @param gameName 
 * @param gameGenre 
 * @param responseLimit 
 * @returns 
 */
export async function getCovers(gameName:string, gameGenre:number, responseLimit:number) {
let condition='';
if(gameName){
    condition = `& name~"${gameName}"*`;
    console.log(condition)
}
else if(gameGenre && gameGenre != 0){
    condition = `& genres=${gameGenre}`;
    console.log(condition)
}

const client_id = process.env.CLIENT_ID
const bearer = process.env.BEARER
const base_url = process.env.BASE_URL

interface PopularGame {
    map(arg0: (game: any) => Promise<any>): unknown;
    id: number,
    game_id: string,
    value: string,
    popularity_type: number
}

interface PopularGameCover {
    id: number,
    name: string,
    genres: number,
    cover: { image_id: string };
}


// async function getPopularGames() {
//     const popularGames:PopularGame[] = await fetch(
//         "https://api.igdb.com/v4/popularity_primitives",
//             { method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Client-ID': `${client_id}`,
//                 'Authorization': `Bearer ${bearer}`,
//                 'Access-Control-Request-Headers': 'Content-Type,API-Key',
//                 'Access-Control-Allow-Origin': `${base_url}`
//             },
//             body: `fields game_id, value, popularity_type; sort value desc; limit ${responseLimit}; where popularity_type = 3;`
//         })  
//         .then(response => response.json())
//         .catch(err => {
//             console.error(err);
//         });

//     if (!popularGames) return [];


//     // El problema del Too many requests esta aqui... Estamos llamando a la api por cada juego envez de descargar todos los juegos a la vez. El maximo son 4
//     const covers: Promise<PopularGameCover[]>[] = popularGames.map(async (game:any) => {
//         return await fetch(
//             "https://api.igdb.com/v4/games",
//                 { method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Client-ID': `${client_id}`,
//                     'Authorization': `Bearer ${bearer}`,
//                     'Access-Control-Request-Headers': 'Content-Type,API-Key',
//                     'Access-Control-Allow-Origin': `${base_url}`
//                 },
//                 body: `fields id, name, genres, cover.image_id; limit ${responseLimit}; where id=${game.game_id};`
//             })

//             .then(response =>response.json())
//             .catch(err => {
//                 console.error(err);
//             });
//     })

//     const popularGamesCovers = await Promise.all(covers)
    
//     return popularGamesCovers

// }

// let popularGamesCovers: any[] = [];

// async function returnGames(){
//     popularGamesCovers = await getPopularGames()
// }
// await returnGames()
// console.log(popularGamesCovers)
// return popularGamesCovers.flat()



const covers = await fetch(
    "https://api.igdb.com/v4/games",
        { method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': `${client_id}`,
            'Authorization': `Bearer ${bearer}`,
            'Access-Control-Request-Headers': 'Content-Type,API-Key',
            'Access-Control-Allow-Origin': `${base_url}`
        },
        body: `fields id, name, genres, cover.image_id; limit ${responseLimit}; where cover != null & cover.image_id !=null & rating !=null & (category=0 | category=2) ${condition};`
    })  
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.error(err);
    });

    return covers;
}
