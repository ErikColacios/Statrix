"use server";
/**
 * Fetches game information from the IDGB Api. The restriction is the game name, the game genre and the offset and limit of responses.
 * @param gameName
 * @param gameGenre
 * @param responseOffset
 * @param responseLimit
 * @returns
 */
export async function fetchGamesIGDB(gameName: string,  gameGenre: number, responseOffset: number, responseLimit: number) {
  let condition = "";

  if (gameName) {
    condition = `; search "${gameName}"`;
  } else if (gameGenre && gameGenre != 0) {
    condition = `& genres=${gameGenre}`;
  }

  const client_id = process.env.CLIENT_ID;
  const bearer = process.env.BEARER;

  async function getPopularGames() {
    const popularGamesRes = await fetch(
      "https://api.igdb.com/v4/popularity_primitives",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Client-ID": client_id!,
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "text/plain",
        },
        body: `
            fields game_id, value;
            where popularity_type = 3;
            sort value desc;
            offset ${responseOffset};
            limit ${responseLimit};
        `,
      },
    );

    const popularGames = await popularGamesRes.json();
    const gameIds = popularGames.map((g: any) => g.game_id).filter(Boolean);
    if (!gameIds.length) return [];

    const gamesRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id!,
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "text/plain",
      },
      body: `
            fields id, name, genres, cover.image_id, rating;
            where id = (${gameIds.join(",")}) 
                & cover != null 
                & cover.image_id != null 
                & rating != null ${condition};
            offset ${responseOffset};
            limit ${responseLimit};
            `,
    });
    const games = await gamesRes.json();

    return games;
  }

  async function getGamesBySearch() {
    const gamesRes = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id!,
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "text/plain",
      },
      body: `
            fields id, name, genres, cover.image_id, rating, release_dates.human;
            where cover != null & cover.image_id != null & rating != null ${condition};
            limit ${responseLimit};
            `,
    });

    let games = await gamesRes.json();

    // If the search returns no results, we try to fetch again with a different query to get more results
    if(games.length === 0) {
            const gamesRes2 = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": client_id!,
                Authorization: `Bearer ${bearer}`,
                "Content-Type": "text/plain",
            },
            body: `
                    fields id, name, genres, cover.image_id, rating, release_dates.human;
                    where cover != null & cover.image_id != null & rating != null & name~*"${gameName}*";
                    limit ${responseLimit};
                    `,
            });
            games = await gamesRes2.json();
    }
    return games;
  }

  if (gameName !== "" || gameGenre !== 0) {
    return await getGamesBySearch();
  } else {
    return await getPopularGames();
  }
}