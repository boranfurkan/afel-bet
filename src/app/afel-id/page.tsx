"use client";
import { ProfileBalance } from "@/components/profile/ProfileBalance";
import { ProfileClaim } from "@/components/profile/ProfileClaim";
import { ProfileNFTs } from "@/components/profile/ProfileNFTs";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";

export default function AfelIdPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Cookie'yi temizle
    Cookies.remove("jwt");
    // Ana sayfaya yönlendir ve geçmişi temizle
    router.replace("/");
  };

  return (
    <div id="stake-section" className="w-full min-h-screen bg-[#1C1C1C] py-20">
      <div className="mx-auto px-4 md:px-[15vw]">
        {/* Logout Butonu */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors duration-300 flex items-center gap-2"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-5 h-full">
            <div className="h-full">
              <ProfileClaim />
            </div>
          </div>
        </div>
        <ProfileNFTs />
      </div>
    </div>
  );
}
