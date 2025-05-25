"use client";

import { Gift } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ProfileClaim = () => {
  const router = useRouter();

  const handleStakeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sessionStorage.setItem("fromAfelId", "true");
    router.push("/stake");
  };

  return (
    <div className="rounded-[24px] border border-white/10 h-full flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center my-8">
        <div className="flex flex-col xl:flex-row items-center gap-8">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr,120px] items-center gap-4">
              <div className="text-white text-xl">
                <Gift size={32} />
              </div>
              <div className="text-[#EBEBE6] text-xl text-left">
                <Gift size={32} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr,120px] items-center gap-4">
              <div className="text-white text-xl">
                <Gift size={32} />
              </div>
              <div className="text-[#EBEBE6] text-xl text-left">
                <Gift size={32} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr,120px] items-center gap-4">
              <div className="text-white text-xl">
                <Gift size={32} />
              </div>
              <div className="text-[#EBEBE6] text-xl text-left">
                <Gift size={32} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr,120px] items-center gap-4">
              <div className="text-white text-xl">
                <Gift size={32} />
              </div>
              <div className="text-[#EBEBE6] text-xl text-left">
                <Gift size={32} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr,120px] items-center gap-4">
              <div className="text-white text-xl">
                <Gift size={32} />
              </div>
              <div className="text-[#EBEBE6] text-xl text-left">
                <Gift size={32} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr,120px] items-center gap-4">
              <div className="text-white text-xl">
                <Gift size={32} />
              </div>
              <div className="text-[#EBEBE6] text-xl text-left">
                <Gift size={32} />
              </div>
            </div>
          </div>
          <div>
            <button
              className="w-[110px] text-white p-2 border border-white rounded-full hover:bg-black/90"
              disabled
            >
              CLAIM ALL
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full h-[2px] bg-white/10" />
        <div className="flex items-center justify-center p-4">
          <button
            onClick={handleStakeClick}
            className="flex items-center self-center gap-4 text-black bg-white hover:bg-[#6C924A] hover:text-white transition-colors duration-300 rounded-full p-2"
          >
            <Image
              src="/icons/stake-icon.svg"
              alt="Stake"
              width={16}
              height={16}
            />
            <span className="text-[16px] whitespace-nowrap">
              STAKE YOUR FELS
            </span>
            <Image
              src="/icons/stake-icon.svg"
              alt="Stake"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
