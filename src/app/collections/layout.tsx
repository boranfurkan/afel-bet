import { AfelIdLayoutProps } from "@/types/afelId";
import bgImage from "/public/images/homebg-2.webp";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import waaLogo from "/public/images/waaLogo.png";
import { CollectionsProvider } from "@/contexts/CollectionsProvider";
export default function StakeLayout({ children }: AfelIdLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#2f2f2e]">
      {/* Ortak arka plan */}
      {/* Ortak Navbar */}
      <CollectionsProvider>
        <div className="relative min-h-screen flex flex-col">
          {children} {/* Page içeriği buraya gelir */}
        </div>
      </CollectionsProvider>
    </div>
  );
}
