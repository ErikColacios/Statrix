// Game that the session user and a match candidate have in common
export type SharedGame = {
    game_id: number,
    game_name: string,
    game_base_image: string,
    favourite: boolean,
}

// User shown in the match page, ordered by affinity with the session user
export type MatchCandidate = {
    user_id: string,
    user_name: string,
    user_avatar: string | null,
    user_banner: string | null,
    user_bio: string | null,
    user_location: string | null,
    common_games: number,
    affinity: number,
    shared_games: SharedGame[],
}
