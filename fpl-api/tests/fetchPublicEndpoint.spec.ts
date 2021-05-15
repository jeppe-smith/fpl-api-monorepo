import nodeFetch from "node-fetch";
import { fetchPublicEndpoint } from "../src/fetchPublicEndpoint";

/**
 * Mock node_modules.
 */
jest.mock("node-fetch", () => jest.fn().mockResolvedValue({ ok: true }));

describe("fetchPublicEndpoint", () => {
  it("calls the endpoint with init", () => {
    const init = {};

    fetchPublicEndpoint(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      init
    );

    expect(nodeFetch).toHaveBeenCalledWith(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
      init
    );
  });

  it("returns response", async () => {
    const result = await fetchPublicEndpoint(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    );

    expect(result).toEqual({ ok: true });
  });

  it("handles not ok response", async () => {
    jest.mock("node-fetch", () =>
      jest.fn(() => {
        return {
          ok: false,
          statusText: "Bad gateway",
        };
      })
    );

    try {
      await fetchPublicEndpoint(
        "https://fantasy.premierleague.com/api/bootstrap-static/"
      );
    } catch (error) {
      expect(error.message).toBe("Bad gateway");
    }
  });
});
