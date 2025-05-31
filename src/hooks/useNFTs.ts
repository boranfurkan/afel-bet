import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchNFTs, fetchNFTMetadata } from '../services/api';
import { NFT } from '@/types/nft';

export const useNFTs = () => {
  const { publicKey } = useWallet();
  const [unstackedNFTs, setUnstackedNFTs] = useState<NFT[]>([]);
  const [stakedNFTs, setStakedNFTs] = useState<NFT[]>([]);
  const [totalStake, setTotalStake] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNFTs = useCallback(async () => {
    if (!publicKey) {
      console.log('No wallet connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching NFTs for wallet:', publicKey.toString());
      const nfts = await fetchNFTs(publicKey.toString());
      console.log('Received NFTs:', nfts);

      const nftsWithMetadata = await Promise.all(
        nfts.map(async (nft) => {
          console.log('Fetching metadata for NFT:', nft.mintAddress);
          try {
            const metadata = await fetchNFTMetadata(nft.uri);
            return {
              ...nft,
              id: nft.mintAddress,
              isSelected: false,
              metadata,
            };
          } catch (error) {
            console.error(
              `Error fetching metadata for NFT ${nft.mintAddress}:`,
              error
            );
            return {
              ...nft,
              id: nft.mintAddress,
              isSelected: false,
            };
          }
        })
      );

      const staked = nftsWithMetadata.filter(
        (nft) => nft.isFrozen && !nft.hasTransferDelegate
      );
      const unstaked = nftsWithMetadata.filter((nft) => !nft.isFrozen);

      setStakedNFTs(staked);
      setUnstackedNFTs(unstaked);
      setTotalStake([...staked, ...unstaked]);
    } catch (err) {
      console.error('Error in loadNFTs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    loadNFTs();
  }, [publicKey, loadNFTs]);

  return {
    unstackedNFTs,
    stakedNFTs,
    totalStake,
    loading,
    error,
    refreshNFTs: loadNFTs,
  };
};
