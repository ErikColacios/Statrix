/** @jest-environment node */
import insertSteamGames from '@/actions/insertSteamGames'
import getSessionUser from '@/actions/getSessionUser'
import getGameInfoByNameIGDB from '@/actions/getGameInfoByNameIGDB'
import { pool } from '@/util/postgres'
import { GameStatus } from '@/enums/GameStatus'

jest.mock('@/util/postgres', () => ({
    pool: { query: jest.fn() },
}))

jest.mock('@/actions/getSessionUser', () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('@/actions/getGameInfoByNameIGDB', () => ({
    __esModule: true,
    default: jest.fn(),
}))

const mockQuery = pool.query as jest.Mock
const mockGetSessionUser = getSessionUser as jest.Mock
const mockGetGameInfoByNameIGDB = getGameInfoByNameIGDB as jest.Mock

const loggedSession = { user: { id: 'user-1' } }
const steamGame = { appid: 1245620, name: 'Elden Ring', playtime_forever: 150 }
const gameIGDB = { id: 119133, name: 'Elden Ring', cover: { image_id: 'co4jni' } }

describe('insertSteamGames', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns an error if the session has no user id', async () => {
        mockGetSessionUser.mockResolvedValueOnce({ user: {} })

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: false, message: 'No user session found.' })
        expect(mockGetGameInfoByNameIGDB).not.toHaveBeenCalled()
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns an error if there is no user session', async () => {
        mockGetSessionUser.mockResolvedValueOnce(undefined)

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: false, message: 'No user session found.' })
        expect(mockGetGameInfoByNameIGDB).not.toHaveBeenCalled()
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('inserts the game with the data matched from IGDB', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockResolvedValueOnce(gameIGDB)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 })

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: true, message: 'Elden Ring imported successfully.' })
        expect(mockGetGameInfoByNameIGDB).toHaveBeenCalledWith('Elden Ring')
        // The user id must come from the session, never from the client
        expect(mockQuery.mock.calls[0][1]).toEqual([
            'user-1',
            119133,
            false,
            0,
            3, // 150 minutes -> 2.5 hours -> rounded to 3
            '-',
            'Elden Ring',
            'co4jni',
            'https://images.igdb.com/igdb/image/upload/t_720p/co4jni.png',
            GameStatus.PLAYING,
        ])
    })

    it('does not overwrite games the user already has', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockResolvedValueOnce(gameIGDB)
        mockQuery.mockResolvedValueOnce({ rowCount: 0 })

        await insertSteamGames(steamGame)

        expect(mockQuery.mock.calls[0][0]).toContain('ON CONFLICT (user_id, game_id) DO NOTHING')
    })

    it('saves 0 hours if Steam does not return a valid playtime', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockResolvedValueOnce(gameIGDB)
        mockQuery.mockResolvedValueOnce({ rowCount: 1 })

        await insertSteamGames({ name: 'Elden Ring', playtime_forever: undefined })

        expect(mockQuery.mock.calls[0][1][4]).toBe(0)
    })

    it('returns not found if the game does not exist in IGDB', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockResolvedValueOnce(undefined)

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: false, message: 'Elden Ring not found in IGDB.' })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns not found if the IGDB game has no cover image', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockResolvedValueOnce({ id: 119133, name: 'Elden Ring' })

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: false, message: 'Elden Ring not found in IGDB.' })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns an error if the IGDB request fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockRejectedValueOnce(new Error('IGDB down'))

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: false, message: 'There was an error inserting Steam games.' })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns an error if the DB query fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockGetGameInfoByNameIGDB.mockResolvedValueOnce(gameIGDB)
        mockQuery.mockRejectedValueOnce(new Error('DB down'))

        const result = await insertSteamGames(steamGame)

        expect(result).toEqual({ success: false, message: 'There was an error inserting Steam games.' })
    })
})
