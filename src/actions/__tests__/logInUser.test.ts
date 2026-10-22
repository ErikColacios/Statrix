/** @jest-environment node */
import { logInUser } from '@/actions/logInUser'
import { pool } from '@/util/postgres'
import bcrypt from 'bcryptjs'

jest.mock('@/util/postgres', () => ({
    pool: { query: jest.fn() },
}))

jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: { compare: jest.fn() },
}))

const mockQuery = pool.query as jest.Mock
const mockCompare = bcrypt.compare as jest.Mock

const verifiedUser = {
    user_id: 'user-1',
    user_name: 'erik',
    user_password: 'hashed-password',
    user_email_verified: true,
}

describe('logInUser', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns an error if no user exists with that user name', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] })

        const result = await logInUser('ghost', '123456')

        expect(result).toEqual({ error: 'No user found with that user name' })
        expect(mockCompare).not.toHaveBeenCalled()
    })

    it('returns wrong credentials if more than one user is found', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [verifiedUser, verifiedUser] })

        const result = await logInUser('erik', '123456')

        expect(result).toEqual({ error: 'Wrong credentials' })
    })

    it('returns an error if the user has no password (Google account)', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ ...verifiedUser, user_password: null }] })

        const result = await logInUser('erik', '123456')

        expect(result).toEqual({ error: 'Something went wrong' })
        expect(mockCompare).not.toHaveBeenCalled()
    })

    it('returns an error if the account is not verified', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ ...verifiedUser, user_email_verified: false }] })

        const result = await logInUser('erik', '123456')

        expect(result).toEqual({ error: 'This account is not yet verified' })
        expect(mockCompare).not.toHaveBeenCalled()
    })

    it('returns wrong credentials if the password does not match', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [verifiedUser] })
        mockCompare.mockResolvedValueOnce(false)

        const result = await logInUser('erik', 'wrong-password')

        expect(result).toEqual({ error: 'Wrong credentials' })
    })

    it('returns the user data if the password matches', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [verifiedUser] })
        mockCompare.mockResolvedValueOnce(true)

        const result = await logInUser('erik', '123456')

        expect(mockCompare).toHaveBeenCalledWith('123456', 'hashed-password')
        expect(result).toEqual({ userIdLogged: 'user-1', userNameLogged: 'erik', passwordMatch: true })
    })

    it('searches the user by user name with a parameterized query', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] })

        await logInUser("erik' OR 1=1 --", '123456')

        // The user name must go as a parameter, never concatenated into the SQL
        const [sql, params] = mockQuery.mock.calls[0]
        expect(sql).not.toContain('erik')
        expect(params).toEqual(["erik' OR 1=1 --"])
    })

    it('returns a generic error if the DB query fails', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        mockQuery.mockRejectedValueOnce(new Error('DB down'))

        const result = await logInUser('erik', '123456')

        expect(result).toEqual({ error: 'An error occurred while logging in' })
    })
})
