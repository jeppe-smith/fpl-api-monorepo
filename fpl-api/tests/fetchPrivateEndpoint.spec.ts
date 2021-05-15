import nodeFetch from "node-fetch";
import fetchCookie from "fetch-cookie/node-fetch";
import { CookieJar } from "tough-cookie";
import { fetchPrivateEndpoint } from "../src/fetchPrivateEndpoint";

/**
 * Setup mock implementations.
 */
const mockNodeFetchResponse = { ok: true, status: 200, json: jest.fn() };
const mockNodeFetch = jest.fn().mockResolvedValue(mockNodeFetchResponse);

/**
 * Mock node_modules.
 */
jest.mock("fetch-cookie/node-fetch", () => jest.fn(() => mockNodeFetch));

describe("fetchPrivateEndpoint", () => {
  afterEach(() => {
    mockNodeFetch.mockClear();
  });

  it("applies cookie jar to fetch", () => {
    const cookieJar = new CookieJar();

    fetchPrivateEndpoint(
      cookieJar,
      "https://fantasy.premierleague.com/api/me/"
    );

    expect(fetchCookie).toHaveBeenCalledWith(nodeFetch, cookieJar);
  });

  it("calls the endpoint with init", () => {
    const cookieJar = new CookieJar();
    const init = {};

    fetchPrivateEndpoint(
      cookieJar,
      "https://fantasy.premierleague.com/api/me/",
      init
    );

    expect(mockNodeFetch).toHaveBeenCalledWith(
      "https://fantasy.premierleague.com/api/me/",
      init
    );
  });

  it("returns response", async () => {
    const cookieJar = new CookieJar();
    const result = await fetchPrivateEndpoint(
      cookieJar,
      "https://fantasy.premierleague.com/api/me/"
    );

    expect(result).toBe(mockNodeFetchResponse);
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

    const cookieJar = new CookieJar();

    try {
      await fetchPrivateEndpoint(
        cookieJar,
        "https://fantasy.premierleague.com/api/me/"
      );
    } catch (error) {
      expect(error.message).toBe("Bad gateway");
    }
  });
});
