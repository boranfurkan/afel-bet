import { AfelIdLayoutProps } from "@/types/afelId";
export default function StakeLayout({ children }: AfelIdLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#2f2f2e]">
      <div className="relative z-10 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}
