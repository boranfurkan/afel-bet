interface RaffleResponse {
  userTotalTicketCount: number;
  systemTotalTicketCount: number;
}

export async function getRaffleData(
  walletAddress: string,
): Promise<RaffleResponse> {
  try {
    const response = await fetch(
      `https://discovery-api.afel.xyz/nft-raffles/check-ticker/${walletAddress}`,
      {
        headers: {
          "x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
          "x-client-id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch raffle data");
    }

    const data: RaffleResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching raffle data:", error);
    return {
      userTotalTicketCount: 0,
      systemTotalTicketCount: 0,
    };
  }
}
