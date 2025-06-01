import Image from "next/image";
import waaLogo from "/public/images/waaLogo.png";
import MagicEdenTicketHeader from "@/components/magic-eden-ticket/MagicEdenTicketHeader";
import MagicEdenTicketContent from "@/components/magic-eden-ticket/MagicEdenTicketContent";

export default function MagicEdenTicketPage() {
  return (
    <div className="flex-1 flex flex-col items-center relative z-40">
      <div className="fixed top-2 left-4 hidden md:block z-20">
        <Image src={waaLogo} alt="waa" width={75} height={75} />
      </div>
      <div className="flex flex-col items-center gap-6 w-full relative z-40">
        <MagicEdenTicketHeader />
        <MagicEdenTicketContent />
      </div>
    </div>
  );
}
