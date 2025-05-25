"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WaapaperNavComponent() {
  const pathname = usePathname();
  const items = [
    { text: "AFEL", path: "/waapaper" },
    { text: "AFELVISION", path: "/waapaper/vision" },
    { text: "$WAA", path: "/waapaper/waatoken" },
    { text: "FEL BENEFITS", path: "/waapaper/fel-benefits" },
    { text: "RACEDOTFUN", path: "/waapaper/racedotfun" },
    { text: "SWIPE2EARN", path: "/waapaper/swipe2earn" },
    { text: "WAABOT", path: "/waapaper/waabot" },
    { text: "IRONNODE", path: "/waapaper/ironnode" },
  ];

  return (
    <div className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:flex-col rounded-md bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md">
        {items.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Link
              href={item.path}
              key={index}
              className="flex justify-center items-center self-stretch"
            >
              <div
                className={`flex justify-center items-center w-full relative px-6 py-4 ${
                  isActive ? "bg-white/[0.24]" : ""
                } transition-all hover:bg-white/[0.12]`}
              >
                <p
                  className={`text-lg ${
                    isActive ? "font-black" : "font-bold"
                  } text-center text-white`}
                >
                  {item.text}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex overflow-x-auto bg-[#181818]/[0.64] border border-white/30 backdrop-blur-md rounded-md scrollbar-hide">
        {items.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <Link href={item.path} key={index} className="flex-shrink-0">
              <div
                className={`px-4 py-3 whitespace-nowrap ${
                  isActive ? "bg-white/[0.24]" : ""
                } transition-all`}
              >
                <p
                  className={`text-sm ${
                    isActive ? "font-black" : "font-bold"
                  } text-center text-white`}
                >
                  {item.text}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
