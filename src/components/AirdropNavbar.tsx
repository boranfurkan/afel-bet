"use client";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { name: "PROFILE", path: "/airdrop/connected" },
  { name: "LEADERBOARD", path: "/airdrop/connected/leaderboard" },
  { name: "RULES", path: "/airdrop/connected/rules" },
];

export default function AirdropNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex w-[327px] md:w-[554px] justify-start items-center self-stretch overflow-hidden rounded-lg bg-[#181818]/[0.64] border border-white/80 backdrop-blur-md font-sans">
      {navItems.map((item, index) => (
        <button
          key={item.name}
          onClick={() => router.push(item.path)}
          className={`flex justify-center items-center flex-grow relative
            px-6 pt-3 pb-2.5 md:pt-[17px] md:pb-[15px]
            ${index === 0 ? "rounded-tl-[7px] rounded-bl-[7px]" : ""}
            ${pathname === item.path ? "bg-white" : ""}
            transition-colors duration-200
          `}
        >
          <p
            className={`flex-grow-0 flex-shrink-0
              text-xs md:text-base
              ${
                pathname === item.path
                  ? "font-black text-black"
                  : "font-bold text-white"
              }
              text-center
            `}
          >
            {item.name}
          </p>
        </button>
      ))}
    </div>
  );
}
