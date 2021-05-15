import nodeFetch from "node-fetch";
import fetchCookie from "fetch-cookie/node-fetch";
import { fetchSession } from "../src/fetchSession";

/**
 * Setup mock implementations..
 */
const mockFormData = { append: jest.fn() };
const mockNodeFetchResponse = { ok: true, status: 200, json: jest.fn() };
const mockNodeFetch = jest.fn().mockResolvedValue(mockNodeFetchResponse);
const mockCookieJar = {
  getCookieStringSync: jest.fn(() => "pl_profile"),
};

/**
 * Mock node_modules.
 */
jest.mock("fetch-cookie/node-fetch", () => jest.fn(() => mockNodeFetch));
jest.mock("form-data", () => jest.fn(() => mockFormData));
jest.mock("tough-cookie", () => {
  return {
    CookieJar: jest.fn(() => mockCookieJar),
  };
});

describe("fetchSession", () => {
  const EMAIL = "example@example.com";
  const PASSWORD = "password";

  afterEach(() => {
    mockFormData.append.mockClear();
    mockNodeFetch.mockClear();
    mockCookieJar.getCookieStringSync.mockClear();
  });

  it("applies cookie jar to fetch", async () => {
    const cookieJar = await fetchSession(EMAIL, PASSWORD);

    expect(fetchCookie).toHaveBeenCalledWith(nodeFetch, cookieJar);
  });

  it("creates form data", () => {
    fetchSession(EMAIL, PASSWORD);

    expect(mockFormData.append).toHaveBeenCalledWith("login", EMAIL);
    expect(mockFormData.append).toHaveBeenCalledWith("password", PASSWORD);
    expect(mockFormData.append).toHaveBeenCalledWith("app", "plfpl-web");
    expect(mockFormData.append).toHaveBeenCalledWith(
      "redirect_uri",
      "https://fantasy.premierleague.com/a/login"
    );
  });

  it("posts to the api with form data", () => {
    fetchSession(EMAIL, PASSWORD);

    expect(mockNodeFetch).toHaveBeenCalledWith(
      "https://users.premierleague.com/accounts/login/",
      {
        method: "POST",
        body: mockFormData,
      }
    );
  });

  it("returns cookie jar", async () => {
    const result = await fetchSession(EMAIL, PASSWORD);

    expect(result).toBe(mockCookieJar);
  });

  it("handles not ok response", async () => {
    jest.mock("fetch-cookie/node-fetch", () =>
      jest.fn(() => {
        return {
          ok: false,
          statusText: "Bad gateway",
        };
      })
    );

    try {
      await fetchSession(EMAIL, PASSWORD);
    } catch (error) {
      expect(error.message).toBe("Bad gateway");
    }
  });

  it("handles wrong credentials", async () => {
    mockCookieJar.getCookieStringSync.mockImplementationOnce(() => "");

    try {
      await fetchSession(EMAIL, PASSWORD);
    } catch (error) {
      expect(error.message).toBe("Unauthorized");
    }
  });
});
