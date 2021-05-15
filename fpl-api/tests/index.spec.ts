import * as fns from "../src";

describe("index", () => {
  it("exports all public functions", () => {
    expect(fns.addToWatchList).toBeDefined();
    expect(fns.fetchBootstrap).toBeDefined();
    expect(fns.fetchClassicLeague).toBeDefined();
    expect(fns.fetchCurrentUser).toBeDefined();
    expect(fns.fetchElementSummary).toBeDefined();
    expect(fns.fetchEntry).toBeDefined();
    expect(fns.fetchEntryEvent).toBeDefined();
    expect(fns.fetchEntryHistory).toBeDefined();
    expect(fns.fetchEventStatus).toBeDefined();
    expect(fns.fetchFixtures).toBeDefined();
    expect(fns.fetchH2HLeagueStandings).toBeDefined();
    expect(fns.fetchH2HMatches).toBeDefined();
    expect(fns.fetchLive).toBeDefined();
    expect(fns.fetchMyTeam).toBeDefined();
    expect(fns.fetchSession).toBeDefined();
    expect(fns.removeFromWatchList).toBeDefined();
  });
});
