
export default function getGameInfoByNameIGDB(gameName: string) {
  const clientId = process.env.CLIENT_ID;
  const bearer = process.env.BEARER;
  const baseUrl = process.env.BASE_URL;

  const res = fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": `${clientId}`,
      Authorization: `Bearer ${bearer}`,
      "Access-Control-Request-Headers": "Content-Type,API-Key",
      "Access-Control-Allow-Origin": `${baseUrl}`,
    },
    body: `fields id, name, cover.image_id;
     limit 1; where cover != null & cover.image_id !=null & involved_companies !=null & name="${gameName}";`,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response[0];
    });
  return res;
}