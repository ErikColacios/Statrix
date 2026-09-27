export default async function getGameInfoByNameIGDB(gameName: string) {
    const clientId = process.env.CLIENT_ID;
    const bearer = process.env.BEARER;

    const response = await fetch(
        "https://api.igdb.com/v4/games",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": clientId!,
                Authorization: `Bearer ${bearer!}`,
            },
            body: `
                fields id, name, cover.image_id;
                limit 1;
                where cover != null & cover.image_id != null & name ~ "${gameName}";
            `,
        }
    );

    if (!response.ok) {
      console.log(`IGDB error: ${response.status} ${response.statusText}`)
        //throw new Error(`IGDB error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data[0];
}