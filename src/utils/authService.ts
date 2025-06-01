// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Cookies from "js-cookie";

interface SessionResponse {
  sessionId: string;
}

// This function doesn't need JWT
export async function getOAuthSession(): Promise<SessionResponse> {
  try {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Client ID or Client Secret is not defined");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/oauth/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawResponse = await response.text();
    try {
      const jsonData = JSON.parse(rawResponse);
      return { sessionId: jsonData.sessionId };
    } catch {
      return { sessionId: rawResponse.trim() };
    }
  } catch (error) {
    console.error("Error getting OAuth session:", error);
    throw error;
  }
}
export async function getOAuthLink(jwt: string): Promise<SessionResponse> {
  try {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Client ID or Client Secret is not defined");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/oauth/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawResponse = await response.text();
    try {
      const jsonData = JSON.parse(rawResponse);
      return { sessionId: jsonData.sessionId };
    } catch {
      return { sessionId: rawResponse.trim() };
    }
  } catch (error) {
    console.error("Error getting OAuth link:", error);
    throw error;
  }
}
export function initiateDiscordAuth(oauthSessionId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const discordAuthUrl = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/discord/${oauthSessionId}`;
  window.location.href = discordAuthUrl;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function initiateXAuth(id: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const xAuthUrl = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/x/${id}`;

    // Discord gibi aynı sayfada yönlendirme yapıyoruz
    window.location.href = xAuthUrl;
  } catch (error) {
    console.error("Error initiating x auth:", error);
    throw error;
  }
}

export async function initiateMatricaAuth(id: string) {
  try {
    const matricaAuthUrl = `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/matrica/${id}`;

    window.location.href = matricaAuthUrl;
  } catch (error) {
    console.error("Error initiating Matrica auth:", error);
    throw error;
  }
}
