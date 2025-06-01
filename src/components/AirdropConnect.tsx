"use client";

interface AirdropConnectProps {
  onConnect?: () => void;
}

export default function AirdropConnect({ onConnect }: AirdropConnectProps) {
  return (
    <div className="flex flex-col justify-start items-center w-full md:w-[891px] gap-6 md:gap-10 mx-auto">
      {/* Title and Description Section */}
      <div className="flex flex-col justify-start items-center w-[327px] md:w-[891px] relative md:space-y-[-16px]">
        <p className="text-7xl md:text-[200px] font-black text-center uppercase text-white">
          AIRDROP
        </p>
        <p className="text-base md:text-xl font-medium text-center text-[#eaecec]">
          <span>
            Airdrop is based on the whitelist. Follow Twitter and Discord to
            become eligible.
          </span>
        </p>
      </div>

      {/* Connect Button */}
      <button
        onClick={onConnect}
        className="w-[327px] md:w-auto md:px-12 pt-5 md:pt-6 pb-4 md:pb-5 bg-white hover:bg-gray-100 transition-colors"
      >
        <p className="text-xl md:text-2xl font-black text-center uppercase text-black">
          connect X
        </p>
      </button>
    </div>
  );
}
