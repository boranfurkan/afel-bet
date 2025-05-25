"use client";
import { AnimatePresence } from "framer-motion";
import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import waaLogo from "/public/images/waaLogo.png";
import WaapaperNavComponent from "@/components/WaapaperNav";
import { usePathname } from "next/navigation";

import homebg6 from "/public/images/homebg-1.webp";
import homebg1 from "/public/images/homebg-2.webp";
import homebg3 from "/public/images/homebg-3.webp";
import homebg4 from "/public/images/homebg-4.webp";
import homebg5 from "/public/images/homebgmobile-5.png";
import homebg2 from "/public/images/homebg-6.webp";
import homebg7 from "/public/images/homebg-7.webp";

export default function WaapaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const getBgImage = () => {
    switch (pathname) {
      case "/waapaper":
        return homebg1;
      case "/waapaper/vision":
        return homebg2;
      case "/waapaper/waatoken":
        return homebg3;
      case "/waapaper/fel-benefits":
        return homebg4;
      case "/waapaper/racedotfun":
        return homebg5;
      case "/waapaper/swipe2earn":
        return homebg6;
      case "/waapaper/ironnode":
        return homebg7;
      default:
        return homebg1;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto relative font-sans pt-[142px]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Image
          src={getBgImage()}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* WAA Logo */}
      <div className="absolute top-2 left-4 hidden md:block z-10">
        <Image src={waaLogo} alt="waa" width={85} height={85} />
      </div>

      <div className="relative z-10 mx-auto px-4 max-w-[1100px]">
        {/* Mobile Navigation */}
        <div className="md:hidden w-full mt-4">
          <WaapaperNavComponent />
        </div>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-0.5 mt-5">
          {/* Desktop Navigation */}
          <div className="hidden md:block w-[250px]">
            <WaapaperNavComponent />
          </div>
          {/* Content */}
          <AnimatePresence mode="wait">
            <main key={pathname} className="flex justify-center w-full flex-1">
              {children}
            </main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
