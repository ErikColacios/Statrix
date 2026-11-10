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

        const result = await logInUserGoogle('google-123', 'erik@gmail.com', true)

        expect(result).toEqual({ userId: 'user-1', userName: 'erik', isNewUser: false })
        // Only the SELECT by Google id was executed, no INSERT
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery.mock.calls[0][1]).toEqual(['google-123'])
    })

    it('creates a new user with the email normalized if it does not exist', async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [] }) // SELECT by Google id
            .mockResolvedValueOnce({ rows: [] }) // SELECT by email
            .mockResolvedValueOnce({})           // INSERT

        const result = await logInUserGoogle('google-123', ' Erik@Gmail.com ', true)

        expect(result).toEqual({ userId: 'fake-user-id', userName: 'Usergoogle-123', isNewUser: true })

        const [insertSql, insertParams] = mockQuery.mock.calls[2]
        expect(insertSql).toContain('INSERT INTO users')
        expect(insertParams).toEqual([
            'fake-user-id', 'Usergoogle-123', 'erik@gmail.com', 'Welcome to my profile!', 'No mans land', 'google-123',
        ])
    })

    it('links the Google account to an existing account with the same verified email', async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [] }) // SELECT by Google id
            .mockResolvedValueOnce({ rows: [{ user_id: 'user-1', user_name: 'erik', user_google_id: null }] }) // SELECT by email
            .mockResolvedValueOnce({})           // UPDATE

        const result = await logInUserGoogle('google-123', 'erik@gmail.com', true)

        expect(result).toEqual({ userId: 'user-1', userName: 'erik', isNewUser: false })
        const [updateSql, updateParams] = mockQuery.mock.calls[2]
        expect(updateSql).toContain('UPDATE users SET user_google_id')
        expect(updateParams).toEqual(['google-123', 'user-1'])
    })

    it('rejects the login if the email is used by another account and Google does not verify it', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        mockQuery
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ user_id: 'user-1', user_name: 'erik', user_google_id: null }] })

        const result = await logInUserGoogle('google-123', 'erik@gmail.com', false)

        expect(result).toBeNull()
        // No UPDATE and no INSERT
        expect(mockQuery).toHaveBeenCalledTimes(2)
    })

    it('rejects the login if the email is used by an account linked to another Google account', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {})
        mockQuery
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ user_id: 'user-1', user_name: 'erik', user_google_id: 'google-999' }] })

        const result = await logInUserGoogle('google-123', 'erik@gmail.com', true)

        expect(result).toBeNull()
        expect(mockQuery).toHaveBeenCalledTimes(2)
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
            .mockResolvedValueOnce({ rows: [] })
            .mockRejectedValueOnce(new Error('duplicate key value violates unique constraint'))

        const result = await logInUserGoogle('google-123', 'erik@gmail.com')

        expect(result).toBeNull()
    })
})
