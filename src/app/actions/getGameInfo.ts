
export default function getGameInfo(gameId:string){

    const client_id = process.env.CLIENT_ID
    const bearer = process.env.BEARER
    const base_url = process.env.BASE_URL

    const res = fetch(
        "https://api.igdb.com/v4/games",
            { method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': `${client_id}`,
                'Authorization': `Bearer ${bearer}`,
                'Access-Control-Request-Headers': 'Content-Type,API-Key',
                'Access-Control-Allow-Origin': `${base_url}`
            },
            body: `fields *, cover.image_id, release_dates.human, involved_companies.company.name, screenshots.image_id; limit 100; where cover != null & cover.image_id !=null & involved_companies !=null & id=${gameId};`
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
            console.log(response)
            return response;
        })
        return res
}