"use client";
import { useNFTs } from "@/hooks/useNFTs";
import Image from "next/image";
import { Spinner } from "../Spinner";
import { useWallet } from "@solana/wallet-adapter-react";

export const ProfileNFTs = () => {
  const { totalStake, loading: loadingNFTs, error: nftError } = useNFTs();

  const { publicKey, signTransaction } = useWallet();

  const renderStakeCard = (item: any) => {
    const nftNumber = item.name.split("#")[1]?.trim();
    const imageUrl = nftNumber
      ? `https://afel.xyz/nft-images/${nftNumber}.png`
      : null;

    return (
      <div key={item.id} className="relative w-full">
        <div className="rounded-[24px] w-full">
          <Image
            src={imageUrl || item?.metadata?.image}
            alt={""}
            className="w-full h-full object-contain rounded-[24px]"
            width={500}
            height={500}
            layout="intrinsic"
            priority
          />

          <div className="bottom-0 left-0 w-full bg-[#1c1c1c] p-2">
            <div className="flex justify-center items-center text-white mb-2">
              <span className="text-sm text-[#989898]">
                {item?.metadata?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loadingNFTs ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner className="border-t-white" />
        </div>
      ) : nftError ? (
        <div className="text-red-500 text-center w-full">{nftError}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8">
          {publicKey && totalStake.map(renderStakeCard)}
        </div>
      )}
    </div>
  );
};
