"use server"

export async function getCovers(gameName:string) {
let condition='';
console.log(gameName)
if(gameName){
    condition = `& name~"${gameName}"*`;
    console.log(condition)
}

const res = await fetch(
    "https://api.igdb.com/v4/games",
        { method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': 'sc5icpsgg08616yi8rjfsm9kvicohm',
            'Authorization': 'Bearer hpdz7egyacd0f1fy1oje1e34hl77ss',
            'Access-Control-Request-Headers': 'Content-Type,API-Key',
            'Access-Control-Allow-Origin': '*'
        },
        body: `fields id, name, cover.image_id; limit 100; where cover != null & cover.image_id !=null ${condition};`
    })
    .then(response => {
        return response.json()
    })
    .then(response => {
        console.log(response)
        return response;

    })
    .catch(err => {
        console.error(err);
    });

    return res;
}
