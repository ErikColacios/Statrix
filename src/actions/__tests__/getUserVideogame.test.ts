/** @jest-environment node */
import getUserVideogame from '@/actions/getUserVideogame'
import getSessionUser from '@/actions/getSessionUser'
import { pool } from '@/util/postgres'

jest.mock('@/util/postgres', () => ({
    pool: { query: jest.fn() },
}))

jest.mock('@/actions/getSessionUser', () => ({
    __esModule: true,
    default: jest.fn(),
}))

const mockQuery = pool.query as jest.Mock
const mockGetSessionUser = getSessionUser as jest.Mock

const loggedSession = { user: { id: 'user-1' } }

describe('getUserVideogame', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('throws if there is no user session', async () => {
        mockGetSessionUser.mockResolvedValueOnce(undefined)

        await expect(getUserVideogame(1942)).rejects.toThrow('The parameter userId is mandatory')
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('throws if no gameId is passed', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)

        await expect(getUserVideogame(0)).rejects.toThrow('The parameter gameId is mandatory')
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns the game of the logged user', async () => {
        const userGame = { user_id: 'user-1', game_id: 1942, score: 9, hours_played: 120 }
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: [userGame] })

        const result = await getUserVideogame(1942)

        expect(result).toEqual(userGame)
        // The user id must come from the session, never from the client
        expect(mockQuery.mock.calls[0][1]).toEqual(['user-1', 1942])
    })

    it('returns undefined if the user does not have that game', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: [] })

        const result = await getUserVideogame(1942)

        expect(result).toBeUndefined()
    })

    it('re-throws the error if the DB query fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockRejectedValueOnce(new Error('DB down'))

        await expect(getUserVideogame(1942)).rejects.toThrow('DB down')
    })
})
