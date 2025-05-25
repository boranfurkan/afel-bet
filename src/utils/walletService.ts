export interface WalletMessage {
  message: string;
}

export interface ConnectWalletPayload {
  walletAddress: string;
  encryptedMessage: string;
  signedMessage: string;
  walletType: "DEFAULT";
}

export interface ConnectedWallet {
  id: string;
  walletAddress: string;
  walletType: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getWalletMessage(jwt: string): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/wallets/message`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "x-api-key": "afel",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the message as plain text
    const message = await response.text();
    return message;
  } catch (error) {
    console.error("Error getting wallet message:", error);
    throw error;
  }
}

export async function connectWallet(
  jwt: string,
  payload: ConnectWalletPayload,
): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/wallets/wallet-sign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
          "x-api-key": "afel",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function getConnectedWallets(
  jwt: string,
): Promise<ConnectedWallet[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/wallets`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "x-api-key": "afel",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting connected wallets:", error);
    throw error;
  }
}

export async function revokeWallet(
  jwt: string,
  walletAddress: string,
): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/wallets/${walletAddress}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
          // 'x-api-key': 'afel',
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error revoking wallet:", error);
    throw error;
  }
}
