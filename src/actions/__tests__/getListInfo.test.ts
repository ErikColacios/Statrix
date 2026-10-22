/** @jest-environment node */
import { getListInfo } from '@/actions/getListInfo'
import { pool } from '@/util/postgres'

jest.mock('@/util/postgres', () => ({
    pool: { query: jest.fn() },
}))

const mockQuery = pool.query as jest.Mock

describe('getListInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns the list info rows', async () => {
        const listInfo = {
            list_id: 'list-1',
            list_name: 'My favourites',
            list_visibility: 'public',
            user_id: 'user-1',
            user_name: 'erik',
        }
        mockQuery.mockResolvedValueOnce({ rows: [listInfo] })

        const result = await getListInfo('list-1')

        expect(result).toEqual([listInfo])
        expect(mockQuery.mock.calls[0][1]).toEqual(['list-1'])
    })

    it('returns an empty array if the list does not exist', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] })

        const result = await getListInfo('non-existing-list')

        expect(result).toEqual([])
    })

    it('returns the error if the DB query fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        const dbError = new Error('DB down')
        mockQuery.mockRejectedValueOnce(dbError)

        const result = await getListInfo('list-1')

        expect(result).toBe(dbError)
    })
})
