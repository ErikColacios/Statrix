"use server";

import { GameIGDB } from "@/types/GameIGDB";
import { rankSearchResults, toSearchText, toSlug } from "@/util/igdbSearch";

// Main games, standalone expansions, remakes, remasters, expanded games and ports. Leaves out DLCs, bundles, mods, packs...
const SEARCH_GAME_TYPES = "(0,4,8,9,10,11)";

/**
 * Fetches game information from the IDGB Api. The restriction is the game name, the game genre and the offset and limit of responses.
 * @param gameName
 * @param gameGenre
 * @param responseOffset
 * @param responseLimit
 * @param gameTheme IGDB theme id (e.g. 19 = Horror). Some categories, like horror, are themes in IGDB and not genres
 * @returns
 */
export async function fetchGamesIGDB(gameName: string,  gameGenre: number, responseOffset: number, responseLimit: number, gameTheme: number = 0) {
  let condition = "";

  if (gameTheme && gameTheme != 0) {
    condition = `& themes=${gameTheme}`;
  } else if (gameGenre && gameGenre != 0) {
    condition = `& genres=${gameGenre}`;
  }

  const client_id = process.env.CLIENT_ID;
  const bearer = process.env.BEARER;

  async function queryIGDB(endpoint: string, body: string) {
    const res = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": client_id!,
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "text/plain",
      },
      body,
    });
    const data = await res.json();

    // On error IGDB returns an object instead of an array
    if (!Array.isArray(data)) {
      console.error("IGDB query failed:", data);
      return [];
    }
    return data;
  }

  async function getPopularGames() {
    const popularGames = await queryIGDB("popularity_primitives", `
            fields game_id, value;
            where popularity_type = 3;
            sort value desc;
            offset ${responseOffset};
            limit ${responseLimit};
        `);

    const gameIds = popularGames.map((g: any) => g.game_id).filter(Boolean);
    if (!gameIds.length) return [];

    const games: GameIGDB[] = await queryIGDB("games", `
            fields id, name, genres, cover.image_id, rating;
            where id = (${gameIds.join(",")})
                & cover != null
                & cover.image_id != null
                & rating != null;
            offset ${responseOffset};
            limit ${responseLimit};
            `);

    return games;
  }

  async function getGamesByGenre() {
    return await queryIGDB("games", `
            fields id, name, genres, cover.image_id, rating, release_dates.human;
            where cover != null & cover.image_id != null & rating != null ${condition};
            limit ${responseLimit};
            `);
  }

  /**
   * Two queries in parallel, then merged and ranked:
   * - "search": IGDB relevance search, tolerates some typos
   * - slug: finds the text inside the game slug, which has no accents or punctuation ("pokemon-legends-arceus")
   * The search text is normalized, so accents, ":" or quotes written by the user don't break the query.
   * There is no "rating != null" here, so new or less known games without rating also appear
   */
  async function getGamesByName() {
    const searchText = toSearchText(gameName);
    const slug = toSlug(gameName);
    // e.g. a name written only with symbols or non latin characters
    if (!searchText) return [];

    const fields = "fields id, name, slug, genres, cover.image_id, rating, total_rating_count, release_dates.human";
    const filters = `cover != null & cover.image_id != null & game_type = ${SEARCH_GAME_TYPES} & version_parent = null`;
    // We ask for more results than needed so the ranking has margin
    const queryLimit = Math.min(Math.max(responseLimit, 50), 500);

    const [searchResults, slugResults] = await Promise.all([
      queryIGDB("games", `${fields}; search "${searchText}"; where ${filters}; limit ${queryLimit};`),
      queryIGDB("games", `${fields}; where ${filters} & slug ~ *"${slug}"*; sort total_rating_count desc; limit ${queryLimit};`),
    ]);

    return rankSearchResults(searchResults, slugResults, slug, responseLimit);
  }

  if (gameName !== "") {
    return await getGamesByName();
  } else if (gameGenre !== 0 || gameTheme !== 0) {
    return await getGamesByGenre();
  } else {
    return await getPopularGames();
  }
}
