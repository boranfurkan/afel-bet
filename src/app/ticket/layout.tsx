import bgImage from "/public/images/homebg-2.webp";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import waaLogo from "/public/images/waaLogo.png";

export default function MagicEdenTicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full">
        <Image
          src={bgImage}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col pt-24 pb-32">{children}</main>
      </div>
    </div>
  );
}
