// Helpers to search games by name in IGDB.
// IGDB "search" fails with accents and punctuation ("pokémon: legends" returns nothing, "pokemon legends" works),
// so the text the user writes is normalized before sending it

type SearchResultGame = {
    id: number,
    slug?: string,
    total_rating_count?: number
}

/**
 * Splits a text into plain words: lowercase, no accents and no punctuation.
 * "Pokémon Legends: Arceus" -> ["pokemon", "legends", "arceus"]
 */
function toWords(text: string): string[] {
    return text
        .normalize("NFD")
        .replace(/\p{M}/gu, "")       // Accents
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/['’`´]/g, "")       // Apostrophes are removed, not split: "baldur's" -> "baldurs"
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
}

/**
 * Text for the IGDB "search" clause. "Pokémon: Legends" -> "pokemon legends"
 */
export function toSearchText(text: string): string {
    return toWords(text).join(" ")
}

/**
 * Same format IGDB uses in the game slugs. "Pokémon Legends: Arceus" -> "pokemon-legends-arceus"
 */
export function toSlug(text: string): string {
    return toWords(text).join("-")
}

/**
 * Merges the results of the "search" query and the slug query, without duplicates, in this order:
 * 1. Exact slug match
 * 2. Slug starts with the text
 * 3. The rest of the "search" results, in the relevance order IGDB returns
 * 4. The rest of the slug results (they contain the text), in the order IGDB returns (most popular first)
 * Inside groups 1 and 2 the most popular games go first.
 */
export function rankSearchResults<T extends SearchResultGame>(searchResults: T[], slugResults: T[], slug: string, limit: number): T[] {
    const unique = new Map<number, T>()
    for (const game of [...searchResults, ...slugResults]) {
        if (!unique.has(game.id)) unique.set(game.id, game)
    }

    const searchOrder = new Map(searchResults.map((game, index) => [game.id, index]))
    const slugOrder = new Map(slugResults.map((game, index) => [game.id, index]))

    function group(game: T) {
        if (game.slug === slug) return 0
        if (game.slug?.startsWith(slug)) return 1
        if (searchOrder.has(game.id)) return 2
        return 3
    }

    return Array.from(unique.values())
        .sort((a, b) => {
            const groupDiff = group(a) - group(b)
            if (groupDiff !== 0) return groupDiff

            switch (group(a)) {
                case 0:
                case 1:
                    return (b.total_rating_count ?? 0) - (a.total_rating_count ?? 0)
                case 2:
                    return searchOrder.get(a.id)! - searchOrder.get(b.id)!
                default:
                    return slugOrder.get(a.id)! - slugOrder.get(b.id)!
            }
        })
        .slice(0, limit)
}
