import nodeFetch, { Response, RequestInit } from "node-fetch";
import fetchCookie from "fetch-cookie/node-fetch";
import { CookieJar } from "tough-cookie";

export async function fetchPrivateEndpoint(
  session: CookieJar,
  endpoint: string,
  init?: RequestInit
): Promise<Response> {
  const fetch = fetchCookie(nodeFetch, session);
  const response = await fetch(endpoint, init);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}
