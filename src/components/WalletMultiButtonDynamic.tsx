import dynamic from "next/dynamic";
import { Spinner } from "./Spinner";

export const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[48px]">
        <Spinner />
      </div>
    ),
  }
);
