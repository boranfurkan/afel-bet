"use client";
import Image from "next/image";

export default function StakeContent() {
  const scrollToStake = () => {
    const element = document.getElementById("stake-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen flex items-center justify-center max-w-4xl mx-4 md:mx-auto max-w-xl">
      <div className="flex flex-col bg-black/70 rounded-[24px] p-5 md:p-7 lg:p-7 text-white">
        {/* Main description */}
        <p className="text-md md:text-lg lg:text-xl mb-7 font-light uppercase">
          Staking your FEL NFT means locking it within the AFEL ecosystem. This
          supports the community’s momentum, and in exchange, you earn points
          towards exclusive rewards.
        </p>

        {/* Points earning section */}
        <div className="mb-7">
          <h2 className="text-md md:text-lg font-black mb-3">How It Works</h2>
          <ul className="flex flex-col text-base md:text-lg font-light list-disc pl-5">
            <li>Lock your FEL NFT. You can unlock anytime.</li>
            <li>Earn points for staying staked.</li>
            <li>Gain access to internal and external airdrops.</li>
          </ul>
        </div>
        {/* Staking works section */}
        <div>
          <h2 className="text-lg md:text-xl font-black mb-3">
            How staking works?
          </h2>
          <ul className="flex flex-col text-base md:text-lg font-light list-disc pl-5">
            <li>Connect your wallet.</li>
            <li>Stake your FEL NFT.</li>
            <li>Track your points and reap your rewards.</li>
          </ul>
        </div>
        <button
          onClick={scrollToStake}
          className="flex items-center self-center gap-4 text-black bg-white hover:bg-[#6C924A] hover:text-white transition-colors duration-300 rounded-full p-4 mt-6"
        >
          <Image
            src="/icons/stake-icon.svg"
            alt="Stake"
            width={24}
            height={24}
          />
          <span className="text-lg font-bold whitespace-nowrap">
            STAKE YOUR FELS
          </span>
          <Image
            src="/icons/stake-icon.svg"
            alt="Stake"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
