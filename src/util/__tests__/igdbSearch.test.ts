/** @jest-environment node */
import { rankSearchResults, toSearchText, toSlug } from '@/util/igdbSearch'

describe('toSearchText', () => {
    it('removes accents and punctuation', () => {
        expect(toSearchText('Pokémon: Legends')).toBe('pokemon legends')
    })

    it('joins the apostrophes instead of splitting the word', () => {
        expect(toSearchText("Baldur's Gate 3")).toBe('baldurs gate 3')
        expect(toSearchText('Baldur’s Gate')).toBe('baldurs gate')
    })

    it('converts & to "and"', () => {
        expect(toSearchText('Ratchet & Clank')).toBe('ratchet and clank')
    })

    it('removes quotes, so they cannot break the IGDB query', () => {
        expect(toSearchText('"Doom" \\ Eternal')).toBe('doom eternal')
    })

    it('returns an empty text if there are no letters or numbers', () => {
        expect(toSearchText(' :- ')).toBe('')
    })
})

describe('toSlug', () => {
    it('uses the same format as the IGDB slugs', () => {
        expect(toSlug('Pokémon Legends: Arceus')).toBe('pokemon-legends-arceus')
        expect(toSlug('  NieR:Automata ')).toBe('nier-automata')
        expect(toSlug('The Legend of Zelda: Breath of the Wild')).toBe('the-legend-of-zelda-breath-of-the-wild')
    })
})

describe('rankSearchResults', () => {
    const game = (id: number, slug: string, total_rating_count?: number) => ({ id, slug, total_rating_count })

    it('puts the exact slug first, then the slugs that start with the text, then the rest', () => {
        const search = [game(1, 'nier-replicant'), game(2, 'nier-automata-game-of-the-yorha'), game(3, 'nier-automata')]
        const slugs = [game(3, 'nier-automata'), game(4, 'super-nier-automata-fan-game')]

        const result = rankSearchResults(search, slugs, 'nier-automata', 10)

        expect(result.map(g => g.id)).toEqual([3, 2, 1, 4])
    })

    it('orders the slug matches by popularity', () => {
        const search = [game(1, 'pokemon-legends-z-a', 74)]
        const slugs = [game(2, 'pokemon-legends-arceus', 227), game(1, 'pokemon-legends-z-a', 74)]

        const result = rankSearchResults(search, slugs, 'pokemon-legends', 10)

        expect(result.map(g => g.id)).toEqual([2, 1])
    })

    it('keeps the IGDB relevance order for the search results', () => {
        const search = [game(1, 'the-witcher-3-wild-hunt'), game(2, 'the-witcher-2')]

        const result = rankSearchResults(search, [], 'witcher-3', 10)

        expect(result.map(g => g.id)).toEqual([1, 2])
    })

    it('does not duplicate games found by both queries', () => {
        const result = rankSearchResults([game(1, 'hades')], [game(1, 'hades')], 'hades', 10)

        expect(result).toHaveLength(1)
    })

    it('returns at most the limit', () => {
        const slugs = [game(1, 'zelda-a'), game(2, 'zelda-b'), game(3, 'zelda-c')]

        expect(rankSearchResults([], slugs, 'zelda', 2)).toHaveLength(2)
    })
})
