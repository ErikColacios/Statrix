import { getSession } from "@/actions/getSession";
import { getIronSession } from "iron-session";

jest.mock("iron-session", () => ({
  getIronSession: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

describe("getSession", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a valid session object when getIronSession resolves successfully", async () => {
    const mockSession = {
      user_name: "UserTest",
      isLoggedIn: true,
    };

    (getIronSession as jest.Mock).mockResolvedValue(mockSession);

    const result = await getSession();

    expect(result).not.toBeNull()
    expect(result?.isLoggedIn).toBeTruthy();
    expect(result?.user_name).toBe("UserTest");
    expect(getIronSession).toHaveBeenCalled();
  });

});
