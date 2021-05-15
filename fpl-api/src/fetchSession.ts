import nodeFetch from "node-fetch";
import fetchCookie from "fetch-cookie/node-fetch";
import FormData from "form-data";
import { CookieJar } from "tough-cookie";

/**
 * Fetch a session to use with protected endpoints.
 * @param email
 * @param password
 */
export async function fetchSession(
  email: string,
  password: string
): Promise<CookieJar> {
  try {
    const cookieJar = new CookieJar();
    const fetch = fetchCookie(nodeFetch, cookieJar);
    const formData = new FormData();
    let response;

    formData.append("login", email);
    formData.append("password", password);
    formData.append("app", "plfpl-web");
    formData.append(
      "redirect_uri",
      "https://fantasy.premierleague.com/a/login"
    );

    response = await fetch("https://users.premierleague.com/accounts/login/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (
      !cookieJar
        .getCookieStringSync("https://premierleague.com")
        .includes("pl_profile")
    ) {
      throw new Error("Unauthorized");
    }

    return cookieJar;
  } catch (error) {
    throw error;
  }
}
