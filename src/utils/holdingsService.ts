interface WalletHolding {
  address: string;
  balance: number;
  uiBalance: string;
}

interface HoldingsResponse {
  wallets: WalletHolding[];
  totalBalance: number;
  totalUiBalance: string;
  totalWallets: number;
}

interface Wallet {
  walletAddress: string;
  // add other wallet properties if needed
}

interface RolesResponse {
  totalOgSpot: number;
  ogTokenRequirement: number;
  wlTokenRequirement: number;
  maxOgPerAccount: number;
  totalOg: number;
  totalWl: number;
  remainingOgSpots: number;
}

export async function getWallets(jwt: string): Promise<Wallet[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/wallets`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          // "x-api-key": "afel",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wallets:", error);
    throw error;
  }
}

export async function getHoldings(
  walletAddresses: string[],
  jwt: string,
): Promise<HoldingsResponse> {
  try {
    // Construct URL with query parameters
    const url = new URL(
      "https://discovery-api.afel.xyz/transactions/wallets/holdings",
    );
    url.searchParams.append("tokenType", "WAA");
    url.searchParams.append("walletAddresses", walletAddresses.join(","));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
        "x-client-id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching holdings:", error);
    throw error;
  }
}

export async function getRoles(jwt: string): Promise<RolesResponse> {
  try {
    const url = new URL("https://discovery-api.afel.xyz/tokens/status");
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
        "x-client-id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching roles: ", error);
    throw error;
  }
}
