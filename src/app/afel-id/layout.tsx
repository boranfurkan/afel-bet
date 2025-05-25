import { AfelIdLayoutProps } from "@/types/afelId";
import bgImage from "/public/images/homebg-6.webp";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AfelIdLayout({ children }: AfelIdLayoutProps) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt");

  if (!jwt) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen w-full bg-[#2f2f2e]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={bgImage}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* Content */}
      <div className="relative z-10 font-sans">{children}</div>
    </div>
  );
}
