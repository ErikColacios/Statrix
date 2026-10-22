/** @jest-environment node */
import { logInUserGoogle } from '@/actions/logInUserGoogle'
import { pool } from '@/util/postgres'

jest.mock('@/util/postgres', () => ({
    pool: { query: jest.fn() },
}))

jest.mock('uuid', () => ({
    v4: () => 'fake-user-id',
}))

const mockQuery = pool.query as jest.Mock

describe('logInUserGoogle', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns the existing user without creating a new one', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ user_id: 'user-1', user_name: 'erik' }] })

        const result = await logInUserGoogle('google-123', 'erik@gmail.com')

        expect(result).toEqual({ userId: 'user-1', userName: 'erik', isNewUser: false })
        // Only the SELECT was executed, no INSERT
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery.mock.calls[0][1]).toEqual(['erik@gmail.com', 'google-123'])
    })

    it('creates a new user if it does not exist', async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [] }) // SELECT: no existing user
            .mockResolvedValueOnce({})           // INSERT

        const result = await logInUserGoogle('google-123', 'erik@gmail.com')

        expect(result).toEqual({ userId: 'fake-user-id', userName: 'Usergoogle-123', isNewUser: true })

        const [insertSql, insertParams] = mockQuery.mock.calls[1]
        expect(insertSql).toContain('INSERT INTO users')
        expect(insertParams).toEqual([
            'fake-user-id', 'Usergoogle-123', 'erik@gmail.com', 'Welcome to my profile!', 'No mans land', 'google-123',
        ])
    })

    it('returns null if the SELECT fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockQuery.mockRejectedValueOnce(new Error('DB down'))

        const result = await logInUserGoogle('google-123', 'erik@gmail.com')

        expect(result).toBeNull()
    })

    it('returns null if the INSERT of the new user fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockQuery
            .mockResolvedValueOnce({ rows: [] })
            .mockRejectedValueOnce(new Error('duplicate key value violates unique constraint'))

        const result = await logInUserGoogle('google-123', 'erik@gmail.com')

        expect(result).toBeNull()
    })
})
