"use client";
import { useNFTRefresh } from "@/contexts/NFTRefreshContext";
import { useNFTs } from "@/hooks/useNFTs";
import { useWalletStats } from "@/hooks/useWalletStats";
import { finalizeTransactionAPI, stakingNFTsAPI } from "@/services/api";
import { NFT } from "@/types/nft";
import { delay } from "@/utils/helpers";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "../Spinner";
import { WalletMultiButtonDynamic } from "../WalletMultiButtonDynamic";

export default function StakeList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("POINTS: SELECT");
  const { stats, loading } = useWalletStats();
  const { publicKey, signTransaction } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const { setRefreshFunction, refreshAllNFTs } = useNFTRefresh();
  const [isStakingAll, setIsStakingAll] = useState(false);
  const [isUnstakingAll, setIsUnstakingAll] = useState(false);
  const [processingNftId, setProcessingNftId] = useState<string | null>(null);

  const {
    totalStake,
    stakedNFTs,
    unstackedNFTs,
    loading: loadingNFTs,
    error: nftError,
    refreshNFTs,
  } = useNFTs();

  const options = ["Highest Points", "Lowest Points"];

  useEffect(() => {
    const cleanup = setRefreshFunction(refreshNFTs);
    return cleanup; // No need to call it, just return the function
  }, [refreshNFTs, setRefreshFunction]);

  // Dışarı tıklamayı dinle
  useEffect(() => {
    const closeDropdown = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener("click", closeDropdown);
      return () => window.removeEventListener("click", closeDropdown);
    }
  }, [isOpen]);

  // Dropdown toggle butonuna tıklamayı durdur
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const stakingNFTsServices = async (
    selectedNFTs: NFT[],
    whichType: "thaw" | "freeze",
    isAll: boolean = false
  ) => {
    if (!publicKey || !signTransaction) {
      setError("Wallet not connected");
      return false;
    }

    // Set loading state based on operation type and if it's a bulk operation
    if (isAll) {
      if (whichType === "freeze") {
        setIsStakingAll(true);
      } else {
        setIsUnstakingAll(true);
      }
    } else {
      setProcessingNftId(selectedNFTs[0].id);
    }

    const nft = selectedNFTs.map((nft) => nft.id);

    try {
      // Get the transaction from the backend for all NFTs at once
      const transactions = await stakingNFTsAPI(
        publicKey.toString(),
        nft,
        whichType
      );

      if (!transactions.length) {
        throw new Error("No transaction received from server");
      }

      // Process all transactions sequentially
      for (const txBase64 of transactions) {
        // Sign the transaction
        const transaction = Transaction.from(Buffer.from(txBase64, "base64"));
        const signedTransaction = await signTransaction(transaction);
        const serializedTransaction = signedTransaction
          .serialize()
          .toString("base64");

        // Finalize the transaction
        await finalizeTransactionAPI(serializedTransaction);
      }

      // Add small delay for blockchain confirmation
      await delay(5000);

      toast.success(
        `Successfully ${whichType === "thaw" ? "unstaked" : "staked"} ${
          selectedNFTs.length
        } NFT${selectedNFTs.length > 1 ? "s" : ""}!`
      );
      refreshAllNFTs();
    } catch (err) {
      console.error("Staking error:", err);

      toast.error("Failed to unstake NFTs");
    } finally {
      setIsStakingAll(false);
      setIsUnstakingAll(false);
      setProcessingNftId(null);
    }
  };

  const renderStakeCard = (item: any) => {
    debugger;
    const nftNumber = item?.metadata?.name?.split("#")[1]?.trim();
    const imageUrl = nftNumber
      ? `https://afel.xyz/nft-images/${nftNumber}.png`
      : null;

    return (
      <div key={item.id} className="relative w-full">
        <div className="rounded-[24px] border border-black w-full">
          <Image
            src={imageUrl || item?.metadata?.image}
            alt={""}
            className="w-full h-full object-contain rounded-t-[24px]"
            width={500}
            height={500}
            layout="intrinsic"
            priority
          />

          <div className="bottom-0 left-0 w-full bg-black p-4  rounded-b-[24px]">
            <div className="flex justify-center items-center text-white mb-2">
              <span className="text-sm text-[#989898]">
                {item?.metadata?.name}
              </span>
            </div>
            <div className="flex justify-center">
              <button
                className={`w-fit px-6 py-2 cursor-pointer rounded-full text-sm transition-all w-[100px] h-[40px] ${
                  item.isFrozen
                    ? "bg-white text-black hover:bg-opacity-90"
                    : "bg-[#6C924A] text-white hover:opacity-90"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  stakingNFTsServices(
                    [item],
                    item.isFrozen ? "thaw" : "freeze"
                  );
                }}
              >
                {processingNftId === item.id ? (
                  <Spinner className="w-4 h-4" />
                ) : item.isFrozen ? (
                  "UNSTAKE"
                ) : (
                  "STAKE"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="stake-section" className="w-full min-h-screen bg-[#ebebe6] py-20">
      <div className="mx-auto px-4 md:px-[15vw]">
        <div className="flex flex-col md:flex-row md:justify-between ">
          {/* Sol Kısım - Başlık ve Açıklama */}
          <div className="flex flex-col justify-between gap-4 md:gap-0">
            <h1 className="text-4xl text-center md:text-start">
              STAKE YOUR FELS!
            </h1>
            <p className="text-sm text-gray-700">
              Each staked FEL will earn 0.1 FEL point per minute.
              <br />
              Spend these points at the Reward Center.
            </p>
            {/* Point Info Box */}
            <div className="inline-flex items-center border border-black px-4 py-2 w-full max-w-[225px]">
              <span className="text-sm">1 MINUTE = 0.1 FEL POINT</span>
            </div>
          </div>

          {/* Sağ Kısım - Stats ve Butonlar */}
          <div className="flex flex-col items-end md:items-normal justify-between md:gap-4">
            {/* Stats */}
            <span className="text-sm">NFTS STAKED</span>
            <span className="font-bold min-w-5 min-h-5">
              {loading ? <Spinner /> : stats?.stakedNFTCount}
            </span>

            <span className="text-sm">TOTAL POINTS</span>
            <span className="font-bold min-w-5 min-h-5">
              {loading ? <Spinner /> : stats?.totalPoints}
            </span>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 w-full md:w-auto md:justify-end">
              <button
                disabled={isStakingAll || unstackedNFTs.length <= 0}
                className="bg-[#6C924A] text-sm text-white px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-50 w-[120px] h-[40px] whitespace-nowrap flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  stakingNFTsServices(unstackedNFTs, "freeze", true);
                }}
              >
                {isStakingAll ? <Spinner className="w-4 h-4" /> : "STAKE ALL"}
              </button>
              <button
                disabled={isUnstakingAll || stakedNFTs.length <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  stakingNFTsServices(stakedNFTs, "thaw", true);
                }}
                className="border border-black text-sm px-6 py-2 rounded-full hover:bg-black/5 disabled:opacity-50 w-[120px] h-[40px] whitespace-nowrap flex items-center justify-center"
              >
                {isUnstakingAll ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  "UNSTAKE ALL"
                )}
              </button>
              <div className="w-auto self-center">
                <WalletMultiButtonDynamic
                  className="bg-white rounded-full hover:bg-black/5"
                  style={{
                    height: "40px",
                    width: "fit-content !important",
                    background: "white",
                    borderRadius: "9999px",
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    border: "none",
                    color: "black",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black/20 my-8" />

        {/* Custom Dropdown */}
        <div className="flex justify-end">
          <div className="relative w-auto">
            <button
              onClick={handleButtonClick}
              className="w-full md:w-auto border border-black rounded-[6px] p-2 pr-10 pl-5 bg-transparent hover:cursor-pointer flex items-center text-sm justify-between min-w-[200px]"
            >
              <span>{selectedOption}</span>
              <span className="absolute right-3">▼</span>
            </button>

            {isOpen && (
              <div className="absolute text-sm top-full left-0 right-0 mt-1 border border-black rounded-[6px] bg-[#2f2f2e] text-white overflow-hidden z-50">
                {options.map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2 hover:bg-black/30 cursor-pointer"
                    onClick={() => {
                      setSelectedOption(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid Container */}
        {loadingNFTs ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Spinner />
          </div>
        ) : nftError ? (
          <div className="text-red-500 text-center w-full">{nftError}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {publicKey && totalStake.map(renderStakeCard)}
          </div>
        )}
      </div>
    </div>
  );
}
