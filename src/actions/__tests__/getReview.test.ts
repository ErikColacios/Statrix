/** @jest-environment node */
import getReview from '@/actions/getReview'
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
const review = { review_id: 'review-1', user_name: 'erik', game_id: 119133, game_name: 'Elden Ring', body: 'Great game', likes: '3', liked_by_user: 1 }

describe('getReview', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns null if no reviewId is passed', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)

        const result = await getReview('')

        expect(result).toBeNull()
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns the review using the user id of the session', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: [review] })

        const result = await getReview('review-1')

        expect(result).toEqual(review)
        expect(mockQuery.mock.calls[0][1]).toEqual(['user-1', 'review-1'])
    })

    it('passes a null user id if there is no session', async () => {
        mockGetSessionUser.mockResolvedValueOnce(undefined)
        mockQuery.mockResolvedValueOnce({ rows: [{ ...review, liked_by_user: 0 }] })

        await getReview('review-1')

        expect(mockQuery.mock.calls[0][1]).toEqual([null, 'review-1'])
    })

    it('returns null if the review does not exist', async () => {
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockResolvedValueOnce({ rows: [] })

        const result = await getReview('non-existing-review')

        expect(result).toBeNull()
    })

    it('returns null if the DB query fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockGetSessionUser.mockResolvedValueOnce(loggedSession)
        mockQuery.mockRejectedValueOnce(new Error('invalid input syntax for type uuid'))

        const result = await getReview('not-a-uuid')

        expect(result).toBeNull()
    })
})
