/** @jest-environment node */
import getPopularLists from '@/actions/getPopularLists'
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

describe('getPopularLists', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('returns an error if there is no session', async () => {
        mockGetSessionUser.mockResolvedValueOnce(undefined)

        const result = await getPopularLists()

        expect(result.success).toBe(false)
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns only public lists from the query', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        const rows = [{ list_id: 'list-1', list_name: 'Metroidvanias', total_games: 8, covers: ['a.jpg'] }]
        mockQuery.mockResolvedValueOnce({ rows })

        const result = await getPopularLists()

        const [sql, params] = mockQuery.mock.calls[0]
        expect(sql).toContain("lst.list_visibility = 'public'")
        expect(params).toEqual([10])
        expect(result).toEqual({ success: true, message: 'Popular lists loaded.', lists: rows })
    })

    it('returns an error if the query fails', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockRejectedValueOnce(new Error('db down'))

        const result = await getPopularLists()

        expect(result.success).toBe(false)
        expect(result.lists).toEqual([])
    })
})
