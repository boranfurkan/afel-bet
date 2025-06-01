export interface NFTMetadata {
  name: string;
  image: string;
  // Add other metadata fields if needed
}

export interface NFT {
  id: string;
  name: string;
  uri: string;
  isFrozen: boolean;
  freezeDelegate: boolean;
  hasTransferDelegate: boolean;
  isSelected?: boolean;
  metadata?: NFTMetadata;
}

export interface NFTResponse {
  mintAddress: string;
  name: string;
  uri: string;
  isFrozen: boolean;
  freezeDelegate: boolean;
  hasTransferDelegate: boolean;
}

export interface Pagination {
  page: number;
  size: number;
}
