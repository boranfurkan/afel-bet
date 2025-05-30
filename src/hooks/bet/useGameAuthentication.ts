import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  gamesAuthControllerGenerateMessage,
  gamesAuthControllerGenerateToken,
  gamesAuthControllerRefreshToken,
} from "@/api";
import { base58 } from "@metaplex-foundation/umi-serializers";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  tokenType: string;
  walletAddress: string;
}

const STORAGE_KEY = "solana-game-auth";

const saveAuthToStorage = (auth: AuthData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

const loadAuthFromStorage = (): AuthData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clearAuthFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const useGameAuthentication = () => {
  const {
    publicKey: connectedPublicKey,
    signMessage,
    disconnecting,
  } = useWallet();

  const [authData, setAuthData] = useState<AuthData | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = loadAuthFromStorage();
    if (stored) {
      setAuthData(stored);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthData(null);
    clearAuthFromStorage();
  }, []);

  const authenticate = useCallback(async () => {
    if (!connectedPublicKey) throw new Error("Wallet not connected");
    if (!signMessage)
      throw new Error("Wallet does not support signing messages");

    try {
      const { message: authMessage } =
        await gamesAuthControllerGenerateMessage();

      if (!authMessage) throw new Error("Failed to get authentication message");

      const encodedMessage = new TextEncoder().encode(authMessage);
      const rawSignature = await signMessage(encodedMessage);
      const [signature] = base58.deserialize(rawSignature);

      const response = await gamesAuthControllerGenerateToken({
        accountId: connectedPublicKey.toBase58(),
        signature,
        message: authMessage,
      });

      const auth: AuthData = {
        ...response,
        walletAddress: connectedPublicKey.toBase58(),
      };

      setAuthData(auth);
      saveAuthToStorage(auth);
    } catch (err) {
      console.warn("User rejected authentication or error occurred:", err);
    }
  }, [connectedPublicKey, signMessage]);

  const refreshIfNeeded = useCallback(async () => {
    if (!authData || isRefreshing) return;

    const now = new Date();
    const accessTokenExp = new Date(authData.accessTokenExpiresAt);

    if (now < accessTokenExp) return;

    if (!authData.refreshToken) {
      logout();
      return;
    }

    try {
      setIsRefreshing(true);
      const refreshed = await gamesAuthControllerRefreshToken({
        refreshToken: authData.refreshToken,
      });

      const newAuthData: AuthData = {
        ...refreshed,
        walletAddress: authData.walletAddress,
      };

      setAuthData(newAuthData);
      saveAuthToStorage(newAuthData);
    } catch (err) {
      console.error("Failed to refresh token", err);
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [authData, isRefreshing, logout]);

  useEffect(() => {
    if (disconnecting) {
      logout();
    }
  }, [disconnecting, logout]);

  useEffect(() => {
    if (!authData) return;

    const interval = setInterval(() => {
      refreshIfNeeded();
    }, 60_000); // every minute

    return () => clearInterval(interval);
  }, [authData, refreshIfNeeded]);

  return {
    isAuthed: !!authData?.accessToken,
    walletAddress: authData?.walletAddress || null,
    accessToken: authData?.accessToken || null,
    authenticate,
    logout,
  };
};
