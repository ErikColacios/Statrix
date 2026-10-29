/** @jest-environment node */
import getFeedActivity from '@/actions/getFeedActivity'
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

function makeRows(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        activity_id: String(100 - i), // bigint columns come back as strings from pg
        user_id: `user-${i}`,
        user_name: `user${i}`,
        user_avatar: null,
        game_id: i,
        game_name: `Game ${i}`,
        game_base_image: 'cover.jpg',
        action: 'completed',
        action_date: new Date(2026, 9, 29 - i),
    }))
}

describe('getFeedActivity', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    it('returns an error if there is no session', async () => {
        mockGetSessionUser.mockResolvedValueOnce(undefined)

        const result = await getFeedActivity()

        expect(result.success).toBe(false)
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('skips the cursor filter on the first page and returns no cursor on the last page', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: makeRows(3) })

        const result = await getFeedActivity()

        const [, params] = mockQuery.mock.calls[0]
        expect(params).toEqual([null, null, 21])
        expect(result.activity).toHaveLength(3)
        expect(result.nextCursor).toBeNull()
    })

    it('returns a cursor pointing to the last item when there are more pages', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        const rows = makeRows(21)
        mockQuery.mockResolvedValueOnce({ rows })

        const result = await getFeedActivity()

        expect(result.activity).toHaveLength(20)
        expect(result.nextCursor).toEqual({ action_date: rows[19].action_date, activity_id: rows[19].activity_id })
    })

    it('passes the cursor to the query', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: [] })
        const cursorDate = new Date(2026, 9, 1)

        await getFeedActivity({ action_date: cursorDate, activity_id: 50 })

        const [, params] = mockQuery.mock.calls[0]
        expect(params).toEqual([cursorDate, 50, 21])
    })

    it('returns an error if the query fails', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockRejectedValueOnce(new Error('db down'))

        const result = await getFeedActivity()

        expect(result.success).toBe(false)
        expect(result.activity).toEqual([])
    })
})
