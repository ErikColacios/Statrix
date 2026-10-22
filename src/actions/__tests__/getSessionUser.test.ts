/** @jest-environment node */
import getSessionUser from '@/actions/getSessionUser'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/util/auth'

// We mock next-auth and the auth config so the real providers (Google, DB...) are never loaded
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/util/auth', () => ({
    authOptions: { fake: 'authOptions' },
}))

const mockGetServerSession = getServerSession as jest.Mock

describe('getSessionUser', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns the session when the user is logged in', async () => {
        const session = { user: { id: 'user-1', name: 'erik' } }
        mockGetServerSession.mockResolvedValueOnce(session)

        const result = await getSessionUser()

        expect(result).toEqual(session)
    })

    it('returns undefined when there is no session', async () => {
        mockGetServerSession.mockResolvedValueOnce(null)

        const result = await getSessionUser()

        expect(result).toBeUndefined()
    })

    it('calls getServerSession with the app authOptions', async () => {
        mockGetServerSession.mockResolvedValueOnce(null)

        await getSessionUser()

        expect(mockGetServerSession).toHaveBeenCalledWith(authOptions)
    })
})