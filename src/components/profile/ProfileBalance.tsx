import Link from "next/link";

export const ProfileBalance = () => {
  return (
    <div className="bg-[#1C1C1C] rounded-[24px] border border-white/10 h-full flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center my-8">
        <div className="flex flex-col gap-8 items-center">
          <div className="flex justify-center items-center gap-4">
            <div className="text-6xl font-mono text-white">0</div>
            <div className="text-6xl font-mono text-white">$WAA</div>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full h-[2px] bg-white/10" />
        <div className="flex items-center justify-between p-4 px-6">
          <div className="flex items-center gap-2">
            <div className="text-[#EBEBE6]">BALANCE:</div>
            <span className="text-[#EBEBE6] font-200">0</span>
            <span className="text-white">$WAA</span>
          </div>
          <Link
            href={"https://magiceden.io/marketplace/afel"}
            target={"_blank"}
            className="w-[110px] text-[16px] text-white p-2 border border-white rounded-full hover:bg-black/90 text-center"
          >
            BUY MORE
          </Link>
        </div>
      </div>
    </div>
  );
};
