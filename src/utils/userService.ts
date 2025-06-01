export interface UserData {
  afelId: string;
  accountId: string;
  discordName: string | null;
  discordId: string | null;
  xName: string | null;
  xId: string | null;
  matricaName: string | null;
  matricaId: string | null;
}

export async function getUserData(jwt: string): Promise<UserData> {
  try {
    if (!jwt) {
      throw new Error("No JWT provided");
    }

    // console.log("Making request with JWT:", jwt); // Debug log

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();
    // console.log("Received user data:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
