import axios from "axios";
import { User } from "@/types/user";
import { LeaderboardResponse } from "@/types/leaderboard";
import { WalletStats } from "@/types/walet";
import { NFTMetadata, NFTResponse, Pagination } from "@/types/nft";

const BASE_URL = "https://discovery-api.afel.xyz";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for cookies/sessions
});

const headers = {
  "x-client-id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
  "x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
  "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
  "Content-Type": "application/json",
};

export const authApi = {
  twitterLogin: () => (window.location.href = `${BASE_URL}/auth/twitter`),
  logout: () => api.post("/auth/logout"),
  getUser: () => api.get<User>("/user"),
};

export const userApi = {
  getProfile: () => api.get<User>("/user"),
  addWallet: (wallet: string) => api.post<User>("/user/add-wallet", { wallet }),
};

export const publicApi = {
  getLeaderboard: () =>
    api.get<LeaderboardResponse>("/public/leaderboard?page=1"),
};

export const fetchWalletStats = async (
  walletAddress: string
): Promise<WalletStats> => {
  try {
    const response = await fetch(
      `${BASE_URL}/nft-staking/wallet-stats/${walletAddress}`,
      {
        headers: {
          "x-client-id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
          "x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch wallet stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching wallet stats:", error);
    throw error;
  }
};

export const fetchNFTs = async (walletAddress: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/nft-staking/nfts/${walletAddress}`,
      {
        headers: {
          "x-client-id": process.env.NEXT_PUBLIC_CLIENT_ID || "",
          "x-client-secret": process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch NFTs");
    }

    const data: NFTResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    throw error;
  }
};

export const fetchNFTMetadata = async (uri: string): Promise<NFTMetadata> => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Failed to fetch NFT metadata");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
};

export const getNftCollectionTraits = async (): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/nft-collection/traits`);
    if (!response.ok) {
      throw new Error("Failed to fetch NFT metadata");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
};
//localhost:3088/nft-collection?page=1&limit=20

export const getNftCollections = async (
  paginationParam: Pagination,
  filters?: any,
  sort?: any
) => {
  try {
    // Base URL'e sayfalama parametrelerini ekleyelim
    const url = new URL(`${BASE_URL}/nft-collection`);
    url.searchParams.append("page", String(paginationParam.page));
    url.searchParams.append("size", String(paginationParam.size));

    // Filtreler varsa query parametrelere ekleyelim
    if (filters.length > 0) {
      url.searchParams.append("filters", JSON.stringify(filters));
    }
    if (sort) {
      url.searchParams.append("sort", sort);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Failed to fetch NFT collections");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT collections:", error);
    throw error;
  }
};

export const stakingNFTsAPI = async (
  walletAddress: string,
  mintAddresses: string[],
  whichType: "thaw" | "freeze"
) => {
  const whichTypePath = whichType === "thaw" ? "thaw-nfts" : "freeze-nfts";
  try {
    const response = await fetch(`${BASE_URL}/nft-staking/${whichTypePath}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        walletAddress,
        mintAddresses,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to thaw NFTs");
    }

    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error("Error thawing NFTs:", error);
    throw error;
  }
};

export const finalizeTransactionAPI = async (signedTransaction: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/nft-staking/finalize-transaction`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          signedTransaction,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to finalize transaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finalizing transaction:", error);
    throw error;
  }
};
