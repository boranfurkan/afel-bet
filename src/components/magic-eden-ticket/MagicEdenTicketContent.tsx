import Image from "next/image";
import felFirst from "/public/reward-images/fel-1.png";
import felSecond from "/public/reward-images/fel-2.png";
import felThird from "/public/reward-images/fel-3.png";

export default function MagicEdenTicketContent() {
  return (
    <div className="flex flex-col font-sans w-full gap-6">
      <div className="flex justify-center items-center w-4/5 md:w-2/5 gap-6 bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md mx-auto rounded-xl mt-20 md:mt-0">
        <p className="text-2xl md:text-4xl font-black text-center text-white p-1 mt-2">
          REWARDS 🎉
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex flex-col">
          <Image
            src={felFirst}
            alt="fel-1"
            width={312}
            height={312}
            className="rounded-t-xl"
          />
          <div className="bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md w-[314px] rounded-b-xl">
            <p className="text-white text-center py-2">FEL #1788</p>
          </div>
        </div>
        <div className="flex flex-col">
          <Image
            src={felSecond}
            alt="fel-2"
            width={312}
            height={312}
            className="rounded-t-xl"
          />
          <div className="bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md w-[314px] rounded-b-xl">
            <p className="text-white text-center py-2">FEL #2788</p>
          </div>
        </div>
        <div className="flex flex-col">
          <Image
            src={felThird}
            alt="fel-3"
            width={312}
            height={312}
            className="rounded-t-xl"
          />
          <div className="bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md w-[314px] rounded-b-xl">
            <p className="text-white text-center py-2">FEL #1254</p>
          </div>
        </div>
      </div>
    </div>
  );
}
