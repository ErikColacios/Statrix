"use server"

interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    playtime_2weeks?: number;
}

interface SteamGamesResponse {
    response: {
        game_count?: number;
        games?: SteamGame[];
    };
}

export async function fetchSteamLibrary(steamId: string): Promise<SteamGame[]> {

    const apiKey = process.env.STEAM_API_KEY;
    
    if (!apiKey) {
        throw new Error("Steam API key not configured");
    }

    const urlOwnedGames = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/");

    urlOwnedGames.searchParams.set("key", apiKey);
    urlOwnedGames.searchParams.set("steamid", steamId);
    urlOwnedGames.searchParams.set("format", "json");
    urlOwnedGames.searchParams.set("include_appinfo", "true");
    urlOwnedGames.searchParams.set("include_played_free_games", "true");

    const response = await fetch(urlOwnedGames.toString(), {
        method: "GET",
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`Steam API error: ${response.status}`);
    }

    const data: SteamGamesResponse = await response.json();
    
    return data.response.games ?? [];
}