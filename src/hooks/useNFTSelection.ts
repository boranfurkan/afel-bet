import { useState, useEffect } from "react";
import { NFT } from "../types/nft";
import { useNFTs } from "./useNFTs";

export const useNFTSelection = () => {
  const { stakedNFTs, unstackedNFTs } = useNFTs();
  const [selectedStakedNFTs, setSelectedStakedNFTs] = useState<NFT[]>([]);
  const [selectedUnstakedNFTs, setSelectedUnstakedNFTs] = useState<NFT[]>([]);

  // Staked NFT'ler için seçim işlemleri
  useEffect(() => {
    setSelectedStakedNFTs(stakedNFTs);
  }, [stakedNFTs]);

  // Unstaked NFT'ler için seçim işlemleri
  useEffect(() => {
    setSelectedUnstakedNFTs(unstackedNFTs);
  }, [unstackedNFTs]);

  const handleSelectStake = (id: string) => {
    setSelectedUnstakedNFTs((prevNfts) =>
      prevNfts.map((nft) =>
        nft.id === id ? { ...nft, isSelected: !nft.isSelected } : nft
      )
    );
  };

  const handleSelectUnstake = (id: string) => {
    setSelectedStakedNFTs((prevNfts) =>
      prevNfts.map((nft) =>
        nft.id === id ? { ...nft, isSelected: !nft.isSelected } : nft
      )
    );
  };

  const handleSelectStakedAll = () => {
    const areAllSelected = selectedStakedNFTs.every((nft) => nft.isSelected);
    setSelectedStakedNFTs((prevNfts) =>
      prevNfts.map((nft) => ({ ...nft, isSelected: !areAllSelected }))
    );
  };

  const handleSelectUnstakedAll = () => {
    const areAllSelected = selectedUnstakedNFTs.every((nft) => nft.isSelected);
    setSelectedUnstakedNFTs((prevNfts) =>
      prevNfts.map((nft) => ({ ...nft, isSelected: !areAllSelected }))
    );
  };

  return {
    stakedNFTs: selectedStakedNFTs,
    unstackedNFTs: selectedUnstakedNFTs,
    handleSelectStake,
    handleSelectUnstake,
    handleSelectStakedAll,
    handleSelectUnstakedAll,
    areAllStakedSelected: selectedStakedNFTs.every((nft) => nft.isSelected),
    areAllUnstakedSelected: selectedUnstakedNFTs.every((nft) => nft.isSelected),
  };
};
