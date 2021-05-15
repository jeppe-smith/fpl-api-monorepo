import { CookieJar } from "tough-cookie";
import { fetchPrivateEndpoint } from "./fetchPrivateEndpoint";
import { ChipName, LeagueType } from "./publicEndpoints";

export interface Me {
  player: Player;
  watched: number[];
}

export interface Player {
  date_of_birth: string;
  dirty: boolean;
  email: string;
  entry: number;
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  region: number;
}

export interface MyTeamPick {
  element: number;
  position: number;
  selling_price: number;
  multiplier: number;
  purchase_price: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface MyTeamChip {
  status_for_entry: "played" | "available";
  played_by_entry: number[];
  name: ChipName;
  number: number;
  start_event: number;
  stop_event: number;
  chip_type: "transfer" | "team";
}

export interface MyTeamTransfers {
  cost: number;
  status: "cost";
  limit: number;
  made: number;
  bank: number;
  value: number;
}

export interface MyTeam {
  picks: MyTeamPick[];
  chips: MyTeamChip[];
  transfers: MyTeamTransfers;
}

export interface ClassicLeague {
  league: ClassicLeagueInfo;
  new_entries: NewLeagueEntry[];
  standings: ClassicLeagueStandings;
}

export interface ClassicLeagueInfo extends LeagueInfo {
  scoring: "c";
}

export interface H2HLeague {
  league: H2HLeagueInfo;
  new_entries: NewLeagueEntry[];
  standings: H2HLeagueStandings;
}

export interface H2HLeagueInfo extends LeagueInfo {
  scoring: "h";
  ko_rounds: number | null;
}

interface LeagueInfo {
  admin_entry: number | null;
  closed: boolean;
  code_privacy: "p";
  created: string;
  id: number;
  league_type: LeagueType;
  max_entries: number | null;
  name: string;
  rank: null;
  start_event: number;
}

export interface NewLeagueEntry {
  entry: number;
  entry_name: string;
  joined_time: string;
  player_first_name: string;
  player_last_name: string;
}

interface LeagueEntry {
  entry: number;
  entry_name: string;
  id: number;
  last_rank: number;
  player_name: string;
  rank: number;
  rank_sort: number;
  total: number;
}

export interface ClassicLeagueEntry extends LeagueEntry {
  event_total: number;
}

export interface H2HLeagueEntry extends LeagueEntry {
  division: 182514;
  matches_drawn: 0;
  matches_lost: 5;
  matches_played: 16;
  matches_won: 11;
  points_for: 872;
}

interface LeagueStandings {
  has_next: boolean;
  page: number;
}

export interface ClassicLeagueStandings extends LeagueStandings {
  results: ClassicLeagueEntry[];
}

export interface H2HLeagueStandings extends LeagueStandings {
  results: H2HLeagueEntry[];
}

export interface H2HMatch {
  entry_1_draw: number;
  entry_1_entry: number;
  entry_1_loss: number;
  entry_1_name: string;
  entry_1_player_name: string;
  entry_1_points: number;
  entry_1_total: number;
  entry_1_win: number;
  entry_2_draw: number;
  entry_2_entry: number;
  entry_2_loss: number;
  entry_2_name: string;
  entry_2_player_name: string;
  entry_2_points: number;
  entry_2_total: number;
  entry_2_win: number;
  event: number;
  id: number;
  is_knockout: boolean;
  seed_value: null;
  tiebreak: null;
  winner: null;
}

export interface H2HLeagueMatches {
  has_next: boolean;
  page: number;
  results: H2HMatch[];
}

/**
 * Fetch an entrys matches from a H2H league.
 * @see {@link fetchSession}
 * @param session Logged in user session.
 * @param leagueId ID of the H2H league.
 * @param entryId ID of the entry whos matches should be fetched.
 * @param page Page number to fetch.
 */
export async function fetchH2HMatches(
  session: CookieJar,
  leagueId: number,
  entryId: number,
  page: number = 1
): Promise<H2HLeagueMatches> {
  const response = await fetchPrivateEndpoint(
    session,
    // tslint:disable-next-line
    `https://fantasy.premierleague.com/api/leagues-h2h-matches/league/${leagueId}/?page=${page}&entry=${entryId}`
  );

  return await response.json();
}

/**
 * Fetch H2H league standings page.
 * @see {@link fetchSession}
 * @param session Logged in user session.
 * @param leagueId ID of a H2H league.
 * @param options Page options.
 * @param options.pageStandings Page number of standings.
 * @param options.pageNewEntries Page number of new entries.
 */
export async function fetchH2HLeagueStandings(
  session: CookieJar,
  leagueId: number,
  { pageStandings, pageNewEntries } = {
    pageStandings: 1,
    pageNewEntries: 1,
  }
): Promise<H2HLeague> {
  const response = await fetchPrivateEndpoint(
    session,
    // tslint:disable-next-line
    `https://fantasy.premierleague.com/api/leagues-h2h/${leagueId}/standings/?page_new_entries=${pageNewEntries}&page_standings=${pageStandings}`
  );

  return await response.json();
}

/**
 * Fetch classic league standings page.
 * @see {@link fetchSession}
 * @param session Logged in user session.
 * @param leagueId ID of a classic league.
 * @param options Page options.
 * @param options.pageStandings Page number of standings.
 * @param options.pageNewEntries Page number of new entries.
 * @param options.phase Phase ID.
 */
export async function fetchClassicLeague(
  session: CookieJar,
  leagueId: number,
  { pageStandings, pageNewEntries, phase } = {
    pageStandings: 1,
    pageNewEntries: 1,
    phase: 1,
  }
): Promise<ClassicLeague> {
  const response = await fetchPrivateEndpoint(
    session,
    // tslint:disable-next-line
    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=${pageNewEntries}&page_standings=${pageStandings}&phase=${phase}`
  );

  return await response.json();
}

/**
 * Remove a player from the current users watchlist.
 * @see {@link fetchSession}
 * @param session
 * @param elementCode
 */
export async function removeFromWatchList(
  session: CookieJar,
  elementCode: number
): Promise<boolean> {
  const response = await fetchPrivateEndpoint(
    session,
    `https://fantasy.premierleague.com/api/watchlist/${elementCode}/`,
    {
      method: "DELETE",
    }
  );

  return response.status === 204;
}

/**
 * Add a player to current users watchlist.
 * @see {@link fetchSession}
 * @param session
 * @param elementCode
 */
export async function addToWatchList(
  session: CookieJar,
  elementCode: number
): Promise<boolean> {
  const response = await fetchPrivateEndpoint(
    session,
    `https://fantasy.premierleague.com/api/watchlist/${elementCode}/`,
    {
      method: "POST",
    }
  );

  return response.status === 201;
}

/**
 * Fetch the team of current user.
 * @see {@link fetchSession}
 * @param session
 * @param entryId
 */
export async function fetchMyTeam(
  session: CookieJar,
  entryId: number
): Promise<MyTeam> {
  const response = await fetchPrivateEndpoint(
    session,
    `https://fantasy.premierleague.com/api/my-team/${entryId}/`
  );

  return await response.json();
}

/**
 * Fetch current user.
 * @see {@link fetchSession}
 * @param session
 */
export async function fetchCurrentUser(session: CookieJar): Promise<Me> {
  const response = await fetchPrivateEndpoint(
    session,
    "https://fantasy.premierleague.com/api/me/"
  );

  return await response.json();
}
