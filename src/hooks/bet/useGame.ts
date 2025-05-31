import { useCallback, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUmi } from "./useUmi";
import {
  gamesControllerDeposit,
  gamesControllerGetGameWalletAddress,
  gamesControllerWithdrawFromCoinFlip,
  useGamesControllerGetBalance,
} from "@/api";
import {
  transferSol,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import { publicKey, sol } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { getReferenceId } from "@/lib/utils";
import { useGameAuthentication } from "./useGameAuthentication";

export type Game = "coinflip" | "slotmachine";

export const DEFAULT_TOKEN_TYPE = "SOL";

export const getQueryOptions = (
  publicKey: string | undefined,
  enabled: boolean,
  queryType: string
) => ({
  query: {
    enabled: !!publicKey && enabled,
    queryKey: [publicKey, queryType],
  },
});

export const useGame = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { publicKey: connectedPublicKey } = useWallet();
  const { isAuthed } = useGameAuthentication();
  const umi = useUmi();

  // Fetch balance
  const {
    data: solBalanceData,
    isLoading: isBalanceLoading,
    refetch: refreshBalance,
    error: balanceError,
  } = useGamesControllerGetBalance(
    {
      tokenType: "SOL",
    },
    getQueryOptions(connectedPublicKey?.toString(), true, "balance")
  );

  // Centralized wallet check
  const checkAuthenticated = useCallback(() => {
    if (!connectedPublicKey) {
      throw new Error("Please connect your wallet");
    } else if (!isAuthed) {
      throw new Error("Please authenticate to play games");
    }
    return connectedPublicKey.toString();
  }, [connectedPublicKey, isAuthed]);

  // Centralized balance check
  const checkBalance = useCallback(
    (amount?: number, skipBalanceCheck: boolean = false) => {
      if (!skipBalanceCheck) {
        if (!solBalanceData) {
          throw new Error("Balance data is not available");
        }
        if (amount && parseFloat(solBalanceData.availableBalance) < amount) {
          throw new Error(
            `Insufficient balance: ${solBalanceData.availableBalance} SOL available`
          );
        }
      }
    },
    [solBalanceData]
  );

  // Deposit SOL to game wallet
  const depositSol = useCallback(
    async (amount: number) => {
      try {
        setIsLoading(true);
        const accountId = checkAuthenticated();
        const { address: destinationWallet } =
          await gamesControllerGetGameWalletAddress();
        const referenceId = getReferenceId();

        const transferResult = await transferSol(umi, {
          source: umi.identity,
          destination: publicKey(destinationWallet),
          amount: sol(amount),
        })
          .add(setComputeUnitPrice(umi, { microLamports: 25_000 }))
          .sendAndConfirm(umi, {
            send: { skipPreflight: true, maxRetries: 3 },
            confirm: { commitment: "processed" },
          });

        const signature = base58.deserialize(transferResult.signature)[0];

        const depositResult = await gamesControllerDeposit({
          referenceId,
          tokenType: "SOL",
          accountId,
          amount: amount.toString(),
          chainTrxId: signature,
          senderWalletAddress: accountId,
          receiverWalletAddress: destinationWallet,
        });

        refreshBalance();

        return depositResult;
      } catch (error) {
        throw new Error(
          `Deposit failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthenticated, umi, refreshBalance]
  );

  // Withdraw SOL from game
  const withdrawSol = useCallback(
    async (amount: number) => {
      try {
        setIsLoading(true);
        const accountId = checkAuthenticated();
        checkBalance(amount);

        const referenceId = getReferenceId();

        const withdrawResult = await gamesControllerWithdrawFromCoinFlip({
          referenceId,
          accountId,
          tokenType: "SOL",
          amount: amount.toString(),
          destinationAddress: accountId,
        });

        refreshBalance();

        return withdrawResult;
      } catch (error) {
        throw new Error(
          `Withdrawal failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthenticated, checkBalance, refreshBalance]
  );

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      solBalance: solBalanceData
        ? {
            ...solBalanceData,
            isLoading: isBalanceLoading,
            error: balanceError, // Expose error for balance
          }
        : undefined,
      isLoading,
      checkBalance,
      refreshBalance,
      checkAuthenticated,
      depositSol,
      withdrawSol,
    }),
    [
      solBalanceData,
      isBalanceLoading,
      balanceError,
      isLoading,
      checkBalance,
      refreshBalance,
      checkAuthenticated,
      depositSol,
      withdrawSol,
    ]
  );
};
