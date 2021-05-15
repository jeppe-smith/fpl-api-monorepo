import fetch, { RequestInit, Response } from "node-fetch";

export async function fetchPublicEndpoint(
  endpoint: string,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(endpoint, init);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response;
}
