/** @jest-environment node */
import { signUpUser } from '@/actions/signUpUser'
import { pool } from '@/util/postgres'
import bcrypt from 'bcryptjs'
import { sendEmailVerifyAccount } from '@/actions/sendEmailVerifyAccount'

// We mock every external dependency so the test never touches the real DB, Resend, etc.
jest.mock('@/util/postgres', () => ({
    pool: { query: jest.fn() },
}))

jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: { hash: jest.fn() },
}))

jest.mock('uuid', () => ({
    v4: () => 'fake-user-id',
}))

jest.mock('@/actions/sendEmailVerifyAccount', () => ({
    sendEmailVerifyAccount: jest.fn(),
}))

const mockQuery = pool.query as jest.Mock
const mockHash = bcrypt.hash as jest.Mock
const mockSendEmail = sendEmailVerifyAccount as jest.Mock

const initialState = { error: undefined }

function createFormData(userName: string, email: string, password: string) {
    const formData = new FormData()
    formData.append('userNameSignUp', userName)
    formData.append('emailSignUp', email)
    formData.append('passwordSignUp', password)
    return formData
}

describe('signUpUser', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('rejects a user name with whitespaces without querying the DB', async () => {
        const formData = createFormData('erik colacios', 'erik@test.com', '123456')

        const result = await signUpUser(initialState, formData)

        expect(result).toEqual({ error: 'The user name must not contain whitespaces' })
        expect(mockQuery).not.toHaveBeenCalled()
    })

    it('rejects the sign up if the user name or email already exists', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ user_id: 'other-id' }] })
        const formData = createFormData('erik', 'erik@test.com', '123456')

        const result = await signUpUser(initialState, formData)

        expect(result).toEqual({ error: 'There is an existing account with this user name or email' })
        // Only the SELECT was executed, no INSERT
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockSendEmail).not.toHaveBeenCalled()
    })

    it('creates the user with the hashed password and sends the verification email', async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [] }) // SELECT: no existing user
            .mockResolvedValueOnce({})           // INSERT
        mockHash.mockResolvedValueOnce('hashed-password')
        mockSendEmail.mockResolvedValueOnce({ status: 200 })
        const formData = createFormData('erik', 'erik@test.com', '123456')

        const result = await signUpUser(initialState, formData)

        expect(result).toBeUndefined()
        expect(mockHash).toHaveBeenCalledWith('123456', 10)

        // The password stored in the DB must be the hashed one, never the plain one
        const insertParams = mockQuery.mock.calls[1][1]
        expect(insertParams).toEqual([
            'fake-user-id', 'erik', 'erik@test.com', 'hashed-password', 'Welcome to my profile!', 'No mans land',
        ])
        expect(insertParams).not.toContain('123456')

        expect(mockSendEmail).toHaveBeenCalledWith('fake-user-id', 'erik', 'erik@test.com')
    })

    it('returns an error if the verification email fails', async () => {
        mockQuery
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({})
        mockHash.mockResolvedValueOnce('hashed-password')
        mockSendEmail.mockResolvedValueOnce({ status: 500 })
        const formData = createFormData('erik', 'erik@test.com', '123456')

        const result = await signUpUser(initialState, formData)

        expect(result).toEqual({ error: 'There was a problem with the email verification.' })
    })

    it('returns the error if the DB query fails', async () => {
        const dbError = new Error('DB down')
        mockQuery.mockRejectedValueOnce(dbError)
        const formData = createFormData('erik', 'erik@test.com', '123456')

        const result = await signUpUser(initialState, formData)

        expect(result).toEqual({ error: dbError })
    })
})
