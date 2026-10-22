/** @jest-environment node */
import { getListContent } from '@/actions/getListContent'
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

describe('getListContent', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    it('returns an error if no listId is passed', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)

        const result = await getListContent('')

        expect(result).toEqual({ success: false, message: 'No list found.' })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns an error if the session has no user id', async () => {
        mockGetSessionUser.mockResolvedValueOnce({ user: {} })

        const result = await getListContent('list-1')

        expect(result).toEqual({ success: false, message: 'No user session found.' })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('does not query the DB if there is no session at all', async () => {
        mockGetSessionUser.mockResolvedValueOnce(undefined)

        const result = await getListContent('list-1')

        expect(result).toMatchObject({ success: false })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns the games of the list', async () => {
        const games = [
            { game_id: 1942, game_name: 'The Witcher 3', rank_order: 1, score: 10, isowner: true },
            { game_id: 1020, game_name: 'GTA V', rank_order: 2, score: 8, isowner: true },
        ]
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: games })

        const result = await getListContent('list-1')

        expect(result).toEqual(games)
        // The user id used to calculate "isowner" must come from the session
        expect(mockQuery.mock.calls[0][1]).toEqual(['list-1', 'user-1'])
    })

    it('returns an empty array if the list has no games', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: [] })

        const result = await getListContent('list-1')

        expect(result).toEqual([])
    })

    it('returns success false if the DB query fails', async () => {
        const dbError = new Error('DB down')
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockRejectedValueOnce(dbError)

        const result = await getListContent('list-1')

        expect(result).toEqual({ success: false, message: dbError })
    })
})
