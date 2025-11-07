import { getSession } from "@/actions/getSession"
import { getIronSession } from "iron-session"


jest.mock('iron-session', () => ({
    getIronSession: jest.fn()
}))

jest.mock('next/headers', () => ({
    cookies: jest.fn()
}))

describe('getSession', ()=> {
    it('should simulate the session creation with the isLoggedIn state as true', async()=>{

        const mockSession = {
            isLoggedIn: true
        };

        (getIronSession as jest.Mock).mockResolvedValue(mockSession)

        const result = await getSession()

        expect(result.isLoggedIn).toBeTruthy()
        expect(getIronSession).toHaveBeenCalled()
    })
})