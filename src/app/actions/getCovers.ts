"use server"

/**
 * Fetches game information from the IDGB Api. The restriction is the game name, the ame genre and the limit of responses.
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

const res = await fetch(
    "https://api.igdb.com/v4/games",
        { method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': `${client_id}`,
            'Authorization': `Bearer ${bearer}`,
            'Access-Control-Request-Headers': 'Content-Type,API-Key',
            'Access-Control-Allow-Origin': `${base_url}`
        },
        body: `fields id, name, genres, cover.image_id; limit ${responseLimit}; where cover != null & cover.image_id !=null ${condition};`
    })
    .then(response => {
        return response.json()
    })
    .then(response => {
        //console.log(response)
        return response;

    })
    .catch(err => {
        console.error(err);
    });

    return res;
}
